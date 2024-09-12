/**
 * Service Methods
 */
import { HttpException } from '../exceptions/HttpException'
import { getWeekRange, getMonthRange, isEmpty } from '../utils/utility';
import { Service } from "typedi";
const { client } = require('../config/elastic');
import { ELASTIC_INDEXNAME } from '../config';

@Service()
class ElasticSearchService {

    public async jobSearch(req: any): Promise<any> {
        const reqObj = req.body;
        let sortBy : any = [{ CreatedDate: { "order": "desc" } }];
        const query : any = [{ match :{ Status__c: 'Open'} }];
        const pageSize = reqObj ? reqObj.pageSize : 10;
        const pageNo = reqObj ? reqObj.pageNo * pageSize : 0;
        console.log('Elastic Search Page',pageNo  )
        if(reqObj.jobFunction) {
            query.unshift({
                query_string: {
                    query: reqObj.jobFunction,
                    fields: ['Job_Function__c'],
                    minimum_should_match: '100%'
                }
            })
        }
        if(reqObj.Keyword) {
           query.unshift({
                query_string: {
                    query: reqObj.Keyword,
                    fields: ['Job_Title__c', 'Name', 'Job_Function__c', 'Mandatory_skills__c'],
                    minimum_should_match: '95%'
                }
            })
        } 
        if(reqObj.Location && reqObj.Location.length) {
            query.unshift({
                query_string: {
                    query: reqObj.Location.join(','),
                    fields: ['Location_List_New__c', 'City__c', 'State__c'],
                    minimum_should_match: '95%'
                }
            })
        } 
        if(reqObj.Jobtype && reqObj.Jobtype.length) {
            let jobTypeQuery = '';
            reqObj.Jobtype.forEach((element: any, i:number) => {
                jobTypeQuery += i !=0 ? ` OR (${element})` : `(${element})`
            });
            query.unshift({
                query_string: {
                    query: reqObj.Jobtype.join(','), // jobTypeQuery,
                    fields: ['Employment_Type_js__c'],
                    minimum_should_match: '100%'
                }
            })
        }
        if(reqObj.Remote) {
            let remote = (reqObj.Remote==='Yes, Remote Work') ? 'Remote' : 'Onsite';
            query.unshift({
                query_string: {
                    query: remote,
                    fields: ['Job_Location_Type__c '],
                    minimum_should_match: '100%'
                }
            })
        }
        if(reqObj.Qualifications) {
            let education = reqObj.Qualifications;
            query.unshift({
                query_string: {
                    query: education,
                    fields: ['Educations__c'],
                    minimum_should_match: '100%'
                }
            })
        }
        if(reqObj.Jobfreshness) {
            let jobfreshness = reqObj.Jobfreshness;
            let date:any = [];
            if(jobfreshness === 'Current Week'){
                date = getWeekRange(0);
            }else if(jobfreshness === 'Last Week'){
                date = getWeekRange(1);
            }else if(jobfreshness === 'Last Month'){
                date = getMonthRange(1);
            }
            else if(jobfreshness === 'Last Quarter'){
                date = getMonthRange(3);
            }
            query.push({
                range: {
                    CreatedDate: {
                        gte: date[1],
                        lte: date[0]
                    }
                }

            })
        }
        let sortKey = 'CreatedDate';
        if(reqObj.OrderBy) {             
           switch (reqObj.OrderBy) {
               case 'Most Recent':
                   sortKey = 'CreatedDate';
               case 'High priority jobs':
                   sortKey = 'Priority__c';
               case 'Popular jobs':
                   sortKey = 'Application_Count__c';
                //case 'Nearby jobs':
                //   sortKey = 'nearby';
            }
            sortBy = [{ [sortKey]: { "order": "desc" } }];
        } else {
            sortBy = [{ [sortKey]: { "order": "desc" } }];
        }
        // if (isEmpty(educationalDegreeId)) throw new HttpException(400, "Please provide Id");
        const jobs: any | null = await client.msearch({
            body: [
                { index: ELASTIC_INDEXNAME },
                {
                    query: {
                        bool: {
                            must: query
                        }
                    },
                    sort: sortBy,
                    size: pageSize,
                    from: pageNo
                }
            ]
        });

        if (!jobs) throw new HttpException(401, 'Error');
        return jobs.responses;
    }

    public async createjob(jobData: any): Promise<any> {
        if (isEmpty(jobData)) throw new HttpException(400, "Please provide job data");
    //     const dataset: any = [Job Order object    // ];
       
        const body = jobData.flatMap((doc: any) => [{ index: { _index: ELASTIC_INDEXNAME } }, doc])
      
        const bulkResponse = await client.bulk({ refresh: true, body });

        const erroredDocuments: any = [];
        if (bulkResponse.errors) {           
            // The items array has the same order of the dataset we just indexed.
            // The presence of the `error` key indicates that the operation
            // that we did for the document has failed.
            bulkResponse.items.forEach((action: any, i: any) => {
              const operation = Object.keys(action)[0]
              if (action[operation].error) {
                erroredDocuments.push({
                  // If the status is 429 it means that you can retry the document,
                  // otherwise it's very likely a mapping error, and you should
                  // fix the document before to try it again.
                  status: action[operation].status,
                  error: action[operation].error,
                  operation: body[i * 2],
                  document: body[i * 2 + 1]
                })
              }
            })
          }
        
          const count = await client.count({ index: ELASTIC_INDEXNAME });
          const jobs = {error: erroredDocuments, count: count};
        if (!jobs) throw new HttpException(401, 'Error');
        return jobs;
    }

    public async jobById(jobId: any): Promise<any> {
        const jobs = await client.msearch({
            body: [
                { index: ELASTIC_INDEXNAME },
                {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {_id : jobId}
                                }
                            ]
                        }
                    }                    
                }
            ]});

        if (!jobs) throw new HttpException(401, 'Error');
        console.log('jobs', jobs.responses);
        return jobs.responses;
    }

    public async deleteJob(jobId: any) {
    const jobs = await client.delete({
            index: "joborders",
            id: jobId,
        });
       
        if (!jobs) throw new HttpException(401, 'Error');
        return jobs;
      }


}

export default ElasticSearchService;


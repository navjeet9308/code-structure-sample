/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { JobCaq } from '@my-app/common/src/candidate/job-interview.interface';
 import JobCaqModel from '../models/job-caq.model';
 import { isEmpty } from '../utils/utility';
 import SalesforceApiService from './sf-composite-api.service';
 import { Service } from "typedi";
 @Service()
 class JobCaqService {
   public async findAllJobCaq(): Promise<JobCaq[]> {
     const JobCaqes: JobCaq[] = await JobCaqModel.find();
     return JobCaqes;
   }
 
   public async findJobCaqById(JobCaqId: string): Promise<JobCaq> {
     if (isEmpty(JobCaqId)) throw new HttpException(400, "Please provide JobCaq ID.");
 
     const findJobCaq: JobCaq | null = await JobCaqModel.findOne({ _id: JobCaqId }!);
     if (!findJobCaq) throw new HttpException(409, "No JobCaq found.");
 
     return findJobCaq;
   }
 
   public async createJobCaq(JobCaqData: JobCaq[]): Promise<JobCaq> {

    if (isEmpty(JobCaqData)) throw new HttpException(400, "You're not previous search");
     const ResObj = [];
     for (let i = 0; i < JobCaqData.length; i++) {
       const sfResponse: any = await SalesforceApiService.fetchSFCompositeAPIService('Prescreen2__c', JobCaqData[i]);
       if (sfResponse && sfResponse.compositeResponse[0] && sfResponse.compositeResponse[0].body) {
        console.log('-------------CAQ ISG RES----------', sfResponse.compositeResponse[0].body);
         ResObj.push({ ...JobCaqData[i], ...{ sfdc_id: sfResponse.compositeResponse[0].body.id } })
       }
    }
    console.log('-------------Create Job CAQ On SF----------', ResObj);
  
   //  const jobCaqRes: any = await JobCaqModel.create({ ...jobCaqData });
     return ResObj[0];  
   }
 
   public async updateJobCaq(JobCaqId: string, JobCaqData: JobCaq): Promise<JobCaq> {
     if (isEmpty(JobCaqData)) throw new HttpException(400, "JobCaq data is required.");
 
     const updateJobCaqById: JobCaq | null = await JobCaqModel.findByIdAndUpdate(JobCaqId, JobCaqData);
     if (!updateJobCaqById) throw new HttpException(409, "Failed to update JobCaq.");
 
     return updateJobCaqById;
   }
 
   public async deleteJobCaq(JobCaqId: string): Promise<JobCaq> {
     const deleteJobCaqById: JobCaq | null = await JobCaqModel.findByIdAndDelete(JobCaqId);
     if (!deleteJobCaqById) throw new HttpException(409, "Failed to delete JobCaq.");
 
     return deleteJobCaqById;
   }
   
 }
 
 export default JobCaqService;
 

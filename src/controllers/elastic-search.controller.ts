import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import PreviousSearchService from '../services/previous-search.service';
import ElasticSearchService from "../services/elastic-search.service";
import { Service } from "typedi";

@Service()
class ElasticSearchController {
    constructor(private readonly elasticSearchService: ElasticSearchService, private previousSearchService: PreviousSearchService ) { }

    public jobSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobsData: any = await this.elasticSearchService.jobSearch(req);
            // Search History
            if(req && req.body && Object.keys(req.body).length > 3 && req.body.pageNo < 1) {
            this.previousSearchService.createPreviousSearch({ search_by_id:  req.body.search_by_id,  execution_pattern:  req.body, execution_at:  new Date()});
            }
            res.status(200).json({ data: jobsData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public createjob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobsData: any = await this.elasticSearchService.createjob(req.body);
            res.status(200).json({ data: jobsData, message: 'Elastic bulk job create' });
        } catch (error) {
            next(error);
        }
    };

    public jobById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = req.params.id;
            const jobsData: any = await this.elasticSearchService.jobById(jobId);
            res.status(200).json({ data: jobsData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public deleteJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const jobId: any = req.params.id;
          const deleteJobData: any = await this.elasticSearchService.deleteJob(jobId);
          res.status(200).json({ data: deleteJobData, message: 'deleted' });
        } catch (error) {
          next(error);
        }
      };
    
}

export default ElasticSearchController;

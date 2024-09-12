import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { JobCaq } from '@my-app/common/src/candidate/job-interview.interface';
import JobCaqService from '../services/job-caq.service';
import { Service } from "typedi";
@Service()
class JobCaqController {
  constructor(private readonly JobCaqService: JobCaqService) { }

  public getJobCaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJobCaqsData: JobCaq[] = await this.JobCaqService.findAllJobCaq();
      res.status(200).json({ data: findAllJobCaqsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getJobCaqById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const JobCaqId: string = req.params.id;
      const findOneJobCaqData: JobCaq = await this.JobCaqService.findJobCaqById(JobCaqId);
      res.status(200).json({ data: findOneJobCaqData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createJobCaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const JobCaqData: any = req.body;
      const createJobCaqData: JobCaq = await this.JobCaqService.createJobCaq(JobCaqData);
      res.status(201).json({ data: createJobCaqData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJobCaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const JobCaqId: string = req.params.id;
      const JobCaqData: any = req.body;
      const updateJobCaqData: JobCaq = await this.JobCaqService.updateJobCaq(JobCaqId, JobCaqData);
      res.status(200).json({ data: updateJobCaqData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJobCaq = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const JobCaqId: string = req.params.id;
      const deleteJobCaqData: JobCaq = await this.JobCaqService.deleteJobCaq(JobCaqId);
      res.status(200).json({ data: deleteJobCaqData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobCaqController;

import { NextFunction, Request, Response } from 'express';
import { JobAgent } from '@my-app/common/src/candidate/job-agent.interface';
import JobAgentService from '../services/job-agent.service';

import { Service } from "typedi";
@Service()
class JobAgentController {
  constructor(private readonly jobAgentService: JobAgentService) { }

  public getJobAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJobAgentsData: JobAgent[] = await this.jobAgentService.findAllJobAgent();
      res.status(200).json({ data: findAllJobAgentsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getJobAgentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobAgentId: string = req.params.id;
      const findOneJobAgentData: JobAgent = await this.jobAgentService.findJobAgentById(jobAgentId);
      res.status(200).json({ data: findOneJobAgentData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createJobAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobAgentData: any = req.body;
      const createJobAgentData: JobAgent = await this.jobAgentService.createJobAgent(jobAgentData);
      res.status(201).json({ data: createJobAgentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJobAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobAgentId: string = req.params.id;
      const jobAgentData: any = req.body;
      const updateJobAgentData: JobAgent = await this.jobAgentService.updateJobAgent(jobAgentId, jobAgentData);
      res.status(200).json({ data: updateJobAgentData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJobAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobAgentId: string = req.params.id;
      const deleteJobAgentData: JobAgent = await this.jobAgentService.deleteJobAgent(jobAgentId);
      res.status(200).json({ data: deleteJobAgentData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobAgentController;

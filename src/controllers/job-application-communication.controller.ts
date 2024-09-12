import { NextFunction, Request, Response } from 'express';
import { JobApplicationCommunication } from '@my-app/common/src/candidate/job-application-communication.interface';
import JobApplicationCommunicationService from '../services/job-application-communication.service';

import { Service } from "typedi";
@Service()
class JobApplicationCommunicationController {
  constructor(private readonly jobApplicationCommunicationService: JobApplicationCommunicationService) { }
  public getJobApplicationCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJobApplicationCommunicationsData: JobApplicationCommunication[] = await this.jobApplicationCommunicationService.findAllJobApplicationCommunication();
      res.status(200).json({ data: findAllJobApplicationCommunicationsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getJobApplicationCommunicationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationCommunicationId: string = req.params.id;
      const findOneJobApplicationCommunicationData: JobApplicationCommunication = await this.jobApplicationCommunicationService.findJobApplicationCommunicationById(jobApplicationCommunicationId);
      res.status(200).json({ data: findOneJobApplicationCommunicationData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createJobApplicationCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationCommunicationData: any = req.body;
      const createJobApplicationCommunicationData: JobApplicationCommunication = await this.jobApplicationCommunicationService.createJobApplicationCommunication(jobApplicationCommunicationData);
      res.status(201).json({ data: createJobApplicationCommunicationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJobApplicationCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationCommunicationId: string = req.params.id;
      const jobApplicationCommunicationData: any = req.body;
      const updateJobApplicationCommunicationData: JobApplicationCommunication = await this.jobApplicationCommunicationService.updateJobApplicationCommunication(jobApplicationCommunicationId, jobApplicationCommunicationData);
      res.status(200).json({ data: updateJobApplicationCommunicationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJobApplicationCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationCommunicationId: string = req.params.id;
      const deleteJobApplicationCommunicationData: JobApplicationCommunication = await this.jobApplicationCommunicationService.deleteJobApplicationCommunication(jobApplicationCommunicationId);
      res.status(200).json({ data: deleteJobApplicationCommunicationData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobApplicationCommunicationController;

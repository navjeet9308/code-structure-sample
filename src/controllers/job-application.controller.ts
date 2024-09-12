import { NextFunction, Request, Response } from 'express';
import { JobApplication } from '@my-app/common/src/candidate/job-application.interface';
import JobApplicationService from '../services/job-application.service';
import CandidateProfileService from '../services/candidate-profile.service';
import { CandidateProfile } from '@my-app/common/src/candidate/candidate-profile.interface';

import { Service } from "typedi";

@Service()
class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService,
    private readonly candidateProfileService: CandidateProfileService) { }

  public getJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJobApplicationsData: JobApplication[] = await this.jobApplicationService.findAllJobApplication();
      res.status(200).json({ data: findAllJobApplicationsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getJobApplicationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationId: string = req.params.id;
      const findOneJobApplicationData: JobApplication = await this.jobApplicationService.findJobApplicationById(jobApplicationId);
      res.status(200).json({ data: findOneJobApplicationData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationData: any = req.body;
      const createJobApplicationData: JobApplication = await this.jobApplicationService.createJobApplication(jobApplicationData);
      res.status(201).json({ data: createJobApplicationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationId: string = req.params.id;
      const jobApplicationData: any = req.body;
      const updateJobApplicationData: JobApplication = await this.jobApplicationService.updateJobApplication(jobApplicationId, jobApplicationData);
      res.status(200).json({ data: updateJobApplicationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJobApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobApplicationId: string = req.params.id;
      const deleteJobApplicationData: JobApplication = await this.jobApplicationService.deleteJobApplication(jobApplicationId);
      res.status(200).json({ data: deleteJobApplicationData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public getApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterObj = req.body ? req.body : {}
      const findAllJobApplicationsData: JobApplication[] = await this.jobApplicationService.findApplications(filterObj);
      const candidateProfile: any = await this.candidateProfileService.findAllCandidateProfileWhere(filterObj);
      res.status(200).json({ data: findAllJobApplicationsData, consentData: candidateProfile.consent, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public sentCAQEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: any = req.body;
      const emailExistData: JobApplication = await this.jobApplicationService.sendCAQEmail(data);
      res.status(201).json({ data: emailExistData, message: 'email sent' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobApplicationController;

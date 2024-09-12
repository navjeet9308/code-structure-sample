import { NextFunction, Request, Response } from 'express';
import { JobOffer } from '@my-app/common/src/candidate/job-offer.interface';
import JobOfferService from '../services/job-offer.service';
import { Service } from "typedi";
@Service()
class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) { }

  public getJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJobOffersData: JobOffer[] = await this.jobOfferService.findAllJobOffer();
      res.status(200).json({ data: findAllJobOffersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getJobOfferById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const findOneJobOfferData: JobOffer = await this.jobOfferService.findJobOfferById(jobOfferId);
      res.status(200).json({ data: findOneJobOfferData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferData: any = req.body;
      const createJobOfferData: JobOffer = await this.jobOfferService.createJobOffer(jobOfferData);
      res.status(201).json({ data: createJobOfferData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const jobOfferData: any = req.body;
      const updateJobOfferData: JobOffer = await this.jobOfferService.updateJobOffer(jobOfferId, jobOfferData);
      res.status(200).json({ data: updateJobOfferData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const deleteJobOfferData: JobOffer = await this.jobOfferService.deleteJobOffer(jobOfferId);
      res.status(200).json({ data: deleteJobOfferData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobOfferController;

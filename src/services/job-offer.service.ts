/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { JobOffer } from '@my-app/common/src/candidate/job-offer.interface';
 import JobOfferModel from '../models/job-offer.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class JobOfferService {
 
   public async findAllJobOffer(): Promise<JobOffer[]> {
     const jobOfferes: JobOffer[] = await JobOfferModel.find();
     return jobOfferes;
   }
 
   public async findJobOfferById(jobOfferId: string): Promise<JobOffer> {
     if (isEmpty(jobOfferId)) throw new HttpException(400, "You're not jobOfferId");
 
     const findJobOffer: JobOffer | null = await JobOfferModel.findOne({ _id: jobOfferId }!);
     if (!findJobOffer) throw new HttpException(409, "You're not jobOfferId");
 
     return findJobOffer;
   }
 
   public async createJobOffer(JobOfferData: JobOffer): Promise<JobOffer> {
     if (isEmpty(JobOfferData)) throw new HttpException(400, "JobOffer data is required.");
     const jobOfferData:any = await JobOfferModel.create({ ...JobOfferData });
 
     return jobOfferData;
   }
 
   public async updateJobOffer(jobOfferId: string, jobOfferData: JobOffer): Promise<JobOffer> {
     if (isEmpty(jobOfferData)) throw new HttpException(400, "You're not previous search");
 
     const updateJobOfferById: JobOffer | null = await JobOfferModel.findByIdAndUpdate(jobOfferId, jobOfferData);
     if (!updateJobOfferById) throw new HttpException(409, "You're not previous search");
 
     return updateJobOfferById;
   }
 
   public async deleteJobOffer(jobOfferId: string): Promise<JobOffer> {
     const deleteJobOfferById: JobOffer | null = await JobOfferModel.findByIdAndDelete(jobOfferId);
     if (!deleteJobOfferById) throw new HttpException(409, "You're not previous search");
 
     return deleteJobOfferById;
   }
 }
 
 export default JobOfferService;
 

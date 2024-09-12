/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { JobApplicationCommunication } from '@my-app/common/src/candidate/job-application-communication.interface';
 import JobApplicationCommunicationModel from '../models/job-application-communication.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class JobApplicationCommunicationService {
 
   public async findAllJobApplicationCommunication(): Promise<JobApplicationCommunication[]> {
     const jobApplicationCommunicationes: JobApplicationCommunication[] = await JobApplicationCommunicationModel.find();
     return jobApplicationCommunicationes;
   }
 
   public async findJobApplicationCommunicationById(jobApplicationCommunicationId: string): Promise<JobApplicationCommunication> {
     if (isEmpty(jobApplicationCommunicationId)) throw new HttpException(400, "You're not jobApplicationCommunicationId");
 
     const findJobApplicationCommunication: JobApplicationCommunication | null = await JobApplicationCommunicationModel.findOne({ _id: jobApplicationCommunicationId }!);
     if (!findJobApplicationCommunication) throw new HttpException(409, "You're not jobApplicationCommunicationId");
 
     return findJobApplicationCommunication;
   }
 
   public async createJobApplicationCommunication(JobApplicationCommunicationData: JobApplicationCommunication): Promise<JobApplicationCommunication> {
     if (isEmpty(JobApplicationCommunicationData)) throw new HttpException(400, "You're not previous search");
 
     const jobApplicationCommunicationData:any = await JobApplicationCommunicationModel.create({ ...JobApplicationCommunicationData });
 
     return jobApplicationCommunicationData;
   }
 
   public async updateJobApplicationCommunication(jobApplicationCommunicationId: string, jobApplicationCommunicationData: JobApplicationCommunication): Promise<JobApplicationCommunication> {
     if (isEmpty(jobApplicationCommunicationData)) throw new HttpException(400, "Data is required.");
 
     const updateJobApplicationCommunicationById: JobApplicationCommunication | null = await JobApplicationCommunicationModel.findByIdAndUpdate(jobApplicationCommunicationId, jobApplicationCommunicationData);
     if (!updateJobApplicationCommunicationById) throw new HttpException(409, "Failed to update.");
 
     return updateJobApplicationCommunicationById;
   }
 
   public async deleteJobApplicationCommunication(jobApplicationCommunicationId: string): Promise<JobApplicationCommunication> {
     const deleteJobApplicationCommunicationById: JobApplicationCommunication | null = await JobApplicationCommunicationModel.findByIdAndDelete(jobApplicationCommunicationId);
     if (!deleteJobApplicationCommunicationById) throw new HttpException(409, "You're not previous search");
 
     return deleteJobApplicationCommunicationById;
   }
 }
 
 export default JobApplicationCommunicationService;
 

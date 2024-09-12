/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { JobAgent } from '@my-app/common/src/candidate/job-agent.interface';
 import JobAgentModel from '../models/job-agent.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class JobAgentService {
 
   public async findAllJobAgent(): Promise<JobAgent[]> {
     const jobAgents: JobAgent[] = await JobAgentModel.find();
     return jobAgents;
   }
 
   public async findJobAgentById(jobAgentId: string): Promise<JobAgent> {
     if (isEmpty(jobAgentId)) throw new HttpException(400, "Please provide job agent ID.");
 
     const findJobAgent: JobAgent | null = await JobAgentModel.findOne({ _id: jobAgentId }!);
     if (!findJobAgent) throw new HttpException(409, "No job agent found.");
 
     return findJobAgent;
   }
 
   public async createJobAgent(JobAgentData: JobAgent): Promise<JobAgent> {
     if (isEmpty(JobAgentData)) throw new HttpException(400, "Job Agent data is required.");
 
     const jobAgentData:any = await JobAgentModel.create({ ...JobAgentData });
 
     return jobAgentData;
   }
 
   public async updateJobAgent(jobAgentId: string, jobAgentData: JobAgent): Promise<JobAgent> {
     if (isEmpty(jobAgentData)) throw new HttpException(400, "Job Agent data is required.");
 
     const updateJobAgentById: JobAgent | null = await JobAgentModel.findByIdAndUpdate(jobAgentId, jobAgentData);
     if (!updateJobAgentById) throw new HttpException(409, "Failed to update job agent.");
 
     return updateJobAgentById;
   }
 
   public async deleteJobAgent(jobAgentId: string): Promise<JobAgent> {
     const deleteJobAgentById: JobAgent | null = await JobAgentModel.findByIdAndDelete(jobAgentId);
     if (!deleteJobAgentById) throw new HttpException(409, "Failed to delete job agent.");
 
     return deleteJobAgentById;
   }
 }
 
 export default JobAgentService;
 

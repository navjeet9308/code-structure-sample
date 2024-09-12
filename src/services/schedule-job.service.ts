/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { ScheduleJob } from '@my-app/common/src/candidate/schedule-job.interface';
 import ScheduleJobModel from '../models/schedule-job.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class ScheduleJobService {
 
   public async findAllScheduleJob(): Promise<ScheduleJob[]> {
     const scheduleJobs: ScheduleJob[] = await ScheduleJobModel.find();
     return scheduleJobs;
   }
 
   public async findScheduleJobById(scheduleJobId: string): Promise<ScheduleJob> {
     if (isEmpty(scheduleJobId)) throw new HttpException(400, "You're not scheduleJobId");
 
     const findScheduleJob: ScheduleJob | null = await ScheduleJobModel.findOne({ _id: scheduleJobId }!);
     if (!findScheduleJob) throw new HttpException(409, "You're not scheduleJobId");
 
     return findScheduleJob;
   }
 
   public async createScheduleJob(ScheduleJobData: ScheduleJob): Promise<ScheduleJob> {
     if (isEmpty(ScheduleJobData)) throw new HttpException(400, "You're not scheduleJob");
 
     const createScheduleJobData:any = await ScheduleJobModel.create({ ...ScheduleJobData });
 
     return createScheduleJobData;
   }
 
   public async updateScheduleJob(scheduleJobId: string, scheduleJobData: ScheduleJob): Promise<ScheduleJob> {
     if (isEmpty(scheduleJobData)) throw new HttpException(400, "You're not scheduleJobData");
 
     const updateScheduleJobById: ScheduleJob | null = await ScheduleJobModel.findByIdAndUpdate(scheduleJobId, scheduleJobData);
     if (!updateScheduleJobById) throw new HttpException(409, "You're not sample");
 
     return updateScheduleJobById;
   }
 
   public async deleteScheduleJob(scheduleJobId: string): Promise<ScheduleJob> {
     const deleteScheduleJobById: ScheduleJob | null = await ScheduleJobModel.findByIdAndDelete(scheduleJobId);
     if (!deleteScheduleJobById) throw new HttpException(409, "You're not sample");
 
     return deleteScheduleJobById;
   }
 }
 
 export default ScheduleJobService;
 

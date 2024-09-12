import { NextFunction, Request, Response } from 'express';
import { ScheduleJob } from '@my-app/common/src/candidate/schedule-job.interface';
import ScheduleJobService from '../services/schedule-job.service';
import { Service } from "typedi";
@Service()
class ScheduleJobController {
  constructor(private readonly scheduleJobService: ScheduleJobService) { }

  public getScheduleJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllScheduleJobsData: ScheduleJob[] = await this.scheduleJobService.findAllScheduleJob();
      res.status(200).json({ data: findAllScheduleJobsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getScheduleJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleJobId: string = req.params.id;
      const findOneScheduleJobData: ScheduleJob = await this.scheduleJobService.findScheduleJobById(scheduleJobId);
      res.status(200).json({ data: findOneScheduleJobData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createScheduleJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleJobData: any = req.body;
      const createScheduleJobData: ScheduleJob = await this.scheduleJobService.createScheduleJob(scheduleJobData);
      res.status(201).json({ data: createScheduleJobData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateScheduleJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleJobId: string = req.params.id;
      const scheduleJobData: any = req.body;
      const updateScheduleJobData: ScheduleJob = await this.scheduleJobService.updateScheduleJob(scheduleJobId, scheduleJobData);
      res.status(200).json({ data: updateScheduleJobData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteScheduleJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleJobId: string = req.params.id;
      const deleteScheduleJobData: ScheduleJob = await this.scheduleJobService.deleteScheduleJob(scheduleJobId);
      res.status(200).json({ data: deleteScheduleJobData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ScheduleJobController;

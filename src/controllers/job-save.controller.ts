import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { SaveJob } from '@my-app/common/src/candidate/save-job.interface'
import SaveJobService from '../services/save-job.service'
import { Service } from "typedi";
@Service()
class SaveJobController {
  constructor(private readonly saveJobService: SaveJobService) { }
  public getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllData: SaveJob[] = await this.saveJobService.findAll(req.body);
      res.status(200).json({ data: findAllData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getDataById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const findOneData: SaveJob = await this.saveJobService.findById(id);
      res.status(200).json({ data: findOneData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createData = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const data: any = req.body;
      const createData: SaveJob = await this.saveJobService.createData(data);
      res.status(201).json({ data: createData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data: any = req.body;
      const updateData: SaveJob = await this.saveJobService.updateData(id, data);
      res.status(200).json({ data: updateData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const deleteData: SaveJob = await this.saveJobService.deleteData(id);
      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default SaveJobController;

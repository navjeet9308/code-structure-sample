import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { State } from '@my-app/common/src/candidate/state.interface';
import StateService from '../services/state.service';
import { Service } from "typedi";
@Service()
class StateController {
  constructor(private readonly stateService: StateService) { }
  public getState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterObj = req.query.country_id ? {country_id:req.query.country_id} : {};
      console.log(filterObj)
      const findAllStateData: State[] = await this.stateService.findAllState(filterObj);
      res.status(200).json({ data: findAllStateData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getStateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stateId: string = req.params.id;
      const findOneStateData: State = await this.stateService.findStateById(stateId);
      res.status(200).json({ data: findOneStateData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stateId: any = req.body;
      const createStateData: State = await this.stateService.createState(stateId);
      res.status(201).json({ data: createStateData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stateId: string = req.params.id;
      const stateData: any = req.body;
      const createStateData: State = await this.stateService.updateState(stateId, stateData);
      res.status(200).json({ data: createStateData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stateId: string = req.params.id;
      const deleteStateData: State = await this.stateService.deleteState(stateId);
      res.status(200).json({ data: deleteStateData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default StateController;

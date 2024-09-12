import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { EducationalDegree } from '@my-app/common/src/candidate/educational-degree.interface';
import EducationalDegreeService from '../services/educational-degree.service';
import { Service } from "typedi";
@Service()
class EducationalDegreeController {
  constructor(private readonly educationalDegreeService: EducationalDegreeService) { }
  public getEducationalDegree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEducationalDegreeData: EducationalDegree[] = await this.educationalDegreeService.findAllEducationalDegree();
      res.status(200).json({ data: findAllEducationalDegreeData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getEducationalDegreeByName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllEducationalDegreeData: EducationalDegree[] = await this.educationalDegreeService.findAllEducationalDegreeByName(name);
      res.status(200).json({ data: findAllEducationalDegreeData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };

  public getEducationalDegreeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalDegreeId: string = req.params.id;
      const findOneEducationalDegreeData: EducationalDegree = await this.educationalDegreeService.findEducationalDegreeById(educationalDegreeId);
      res.status(200).json({ data: findOneEducationalDegreeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createEducationalDegree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalDegreeData: any = req.body;
      const createEducationalDegreeData: EducationalDegree = await this.educationalDegreeService.createEducationalDegree(educationalDegreeData);
      res.status(201).json({ data: createEducationalDegreeData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateEducationalDegree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalDegreeId: string = req.params.id;
      const educationalDegreeData: any = req.body;
      const updateCandidateNotificationData: EducationalDegree = await this.educationalDegreeService.updateEducationalDegree(educationalDegreeId, educationalDegreeData);
      res.status(200).json({ data: updateCandidateNotificationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEducationalDegree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalDegreeId: string = req.params.id;
      const deleteEducationalDegreeData: EducationalDegree = await this.educationalDegreeService.deleteEducationalDegree(educationalDegreeId);
      res.status(200).json({ data: deleteEducationalDegreeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default EducationalDegreeController;

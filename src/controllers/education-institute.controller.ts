import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { EducationInstitute } from '@my-app/common/src/candidate/education-institute.interface';
import EducationalInstituteService from '../services/education-institute.service';
import { Service } from "typedi";
@Service()
class EducationalInstituteController {
  constructor(private readonly educationalInstituteService: EducationalInstituteService) { }
  public getEducationalInstitute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEducationalInstituteData: EducationInstitute[] = await this.educationalInstituteService.findAllEducationInstitute();
      res.status(200).json({ data: findAllEducationalInstituteData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getEducationalInstituteByName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllEducationalInstituteData: EducationInstitute[] = await this.educationalInstituteService.findAllEducationInstituteByName(name);
      res.status(200).json({ data: findAllEducationalInstituteData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };

  public getEducationalInstituteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalInstituteId: string = req.params.id;
      const findOneEducationalInstituteData: EducationInstitute = await this.educationalInstituteService.findEducationInstituteById(educationalInstituteId);
      res.status(200).json({ data: findOneEducationalInstituteData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createEducationalInstitute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalInstituteData: any = req.body;
      const createEducationalInstituteData: EducationInstitute = await this.educationalInstituteService.createEducationInstitute(educationalInstituteData);
      res.status(201).json({ data: createEducationalInstituteData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateEducationalInstitute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalInstituteId: string = req.params.id;
      const educationalInstituteData: any = req.body;
      const updateEducationalInstituteData: EducationInstitute = await this.educationalInstituteService.updateEducationInstitute(educationalInstituteId, educationalInstituteData);
      res.status(200).json({ data: updateEducationalInstituteData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEducationalInstitute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const educationalInstituteId: string = req.params.id;
      const deleteEducationalInstituteData: EducationInstitute = await this.educationalInstituteService.deleteEducationInstitute(educationalInstituteId);
      res.status(200).json({ data: deleteEducationalInstituteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default EducationalInstituteController;

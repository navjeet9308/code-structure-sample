import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Langauge } from '@my-app/common/src/candidate/langauge.interface'
import LanguageService from '../services/language.service';
import { Service } from "typedi";
@Service()
class LanguageController {
  constructor(private readonly languageService: LanguageService) { }
  public getLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllLanguageData: Langauge[] = await this.languageService.findAllLangauge();
      res.status(200).json({ data: findAllLanguageData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getLanguageByName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllLanguageData: Langauge[] = await this.languageService.findAllLangaugeByName(name);
      res.status(200).json({ data: findAllLanguageData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };
  
  public getLanguageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const languageId: string = req.params.id;
      const findOneLanguageData: Langauge = await this.languageService.findLangaugeById(languageId);
      res.status(200).json({ data: findOneLanguageData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const languageData: any = req.body;
      const createLanguageData: Langauge = await this.languageService.createLangauge(languageData);
      res.status(201).json({ data: createLanguageData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const languageId: string = req.params.id;
      const languageData: any = req.body;
      const updateLanguageData: Langauge = await this.languageService.updateLangauge(languageId, languageData);
      res.status(200).json({ data: updateLanguageData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const languageId: string = req.params.id;
      const deleteLanguageData: Langauge = await this.languageService.deleteLangauge(languageId);
      res.status(200).json({ data: deleteLanguageData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default LanguageController;

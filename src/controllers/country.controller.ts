import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Country } from '@my-app/common/src/candidate/country.interface';
import CountryService from '../services/country.service';
import { Service } from "typedi";
@Service()
class CountryController {
  constructor(private readonly countryService: CountryService) { }
  public getCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCountryData: Country[] = await this.countryService.findAllCountry();
      res.status(200).json({ data: findAllCountryData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getCountryByName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllEducationalInstituteData: Country[] = await this.countryService.findAllCountryByName(name);
      res.status(200).json({ data: findAllEducationalInstituteData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };
  public getCountryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId: string = req.params.id;
      const findOneCountryData: Country = await this.countryService.findCountryById(countryId);
      res.status(200).json({ data: findOneCountryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryData: any = req.body;
      const createCountryData: Country = await this.countryService.createCountry(countryData);
      res.status(201).json({ data: createCountryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId: string = req.params.id;
      const countryData: any = req.body;
      const updateCountryData: Country = await this.countryService.updateCountry(countryId, countryData);
      res.status(200).json({ data: updateCountryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId: string = req.params.id;
      const deleteCountryData: Country = await this.countryService.deleteCountry(countryId);
      res.status(200).json({ data: deleteCountryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CountryController;

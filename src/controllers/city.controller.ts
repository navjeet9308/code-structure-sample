import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { City } from '@my-app/common/src/candidate/city.interface';
import CityService from '../services/city.service';
import { Service } from "typedi";
@Service()
class CityController {
  constructor(private readonly cityService: CityService) { }
  public getCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCityData: City[] = await this.cityService.findAllCity();
      res.status(200).json({ data: findAllCityData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cityId: string = req.params.id;
      const findOneCityData: City = await this.cityService.findCityById(cityId);
      res.status(200).json({ data: findOneCityData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const cityData: any = req.body;
      const createCityData: City = await this.cityService.createCity(cityData);
      res.status(201).json({ data: createCityData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cityId: string = req.params.id;
      const cityData: any = req.body;
      const updateLanguageData: City = await this.cityService.updateCity(cityId, cityData);
      res.status(200).json({ data: updateLanguageData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cityId: string = req.params.id;
      const deleteCityData: City = await this.cityService.deleteCity(cityId);
      res.status(200).json({ data: deleteCityData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CityController;

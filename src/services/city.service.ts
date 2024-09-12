/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { City } from '@my-app/common/src/candidate/city.interface';
 import CityModel from '../models/city.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CityService {
 
   public async findAllCity(): Promise<City[]> {
     const cities: City[] = await CityModel.find();
     return cities;
   }
 
   public async findCityById(cityId: string): Promise<City> {
     if (isEmpty(cityId)) throw new HttpException(400, "City Id is required");
 
     const findCity: City | null = await CityModel.findOne({ _id: cityId }!);
     if (!findCity) throw new HttpException(409, "City not found ");
 
     return findCity;
   }
 
   public async createCity(cityData: City): Promise<City> {
     if (isEmpty(cityData)) throw new HttpException(400, "City data is required");
 
     const createcityData:any = await CityModel.create({ ...cityData });
 
     return createcityData;
   }
 
   public async updateCity(cityId: string, cityData: City): Promise<City> {
     if (isEmpty(cityData)) throw new HttpException(400, "City data is required");
 
     const updateCityById: City | null = await CityModel.findByIdAndUpdate(cityId, cityData);
     if (!updateCityById) throw new HttpException(409, "Failed to update city");
 
     return updateCityById;
   }
 
   public async deleteCity(cityId: string): Promise<City> {
     const deleteCityById: City | null = await CityModel.findByIdAndDelete(cityId);
     if (!deleteCityById) throw new HttpException(409, "Failed to delete certificate");
 
     return deleteCityById;
   }
 }
 
 export default CityService;
 

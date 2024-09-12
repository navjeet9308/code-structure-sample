/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Country } from '@my-app/common/src/candidate/country.interface';
 import CountryModel from '../models/country.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CountryService {
 
   public async findAllCountry(): Promise<any[]> {
      const countries: Country[] = await CountryModel.find();
      return countries;
   }
   public async findAllCountryByName(name: string): Promise<any[]> {
    const countries = await CountryModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return countries;
  }
   
   
   public async findCountryById(countryId: string): Promise<Country> {
     if (isEmpty(countryId)) throw new HttpException(400, "Country Id is required");
 
     const findCountry: Country | null = await CountryModel.findOne({ _id: countryId }!);
     if (!findCountry) throw new HttpException(409, "Country not found ");
 
     return findCountry;
   }
 
   public async createCountry(countryData: Country): Promise<Country> {
     if (isEmpty(countryData)) throw new HttpException(400, "Country data is required");
 
     const createCountryData:any = await CountryModel.create({ ...countryData });
 
     return createCountryData;
   }
 
   public async updateCountry(countryId: string, countryData: Country): Promise<Country> {
     if (isEmpty(countryData)) throw new HttpException(400, "Country data is required");
 
     const updateCountryById: Country | null = await CountryModel.findByIdAndUpdate(countryId, countryData);
     if (!updateCountryById) throw new HttpException(409, "Failed to update country");
 
     return updateCountryById;
   }
 
   public async deleteCountry(countryId: string): Promise<Country> {
     const deleteCountryById: Country | null = await CountryModel.findByIdAndDelete(countryId);
     if (!deleteCountryById) throw new HttpException(409, "Failed to delete certificate");
 
     return deleteCountryById;
   }
 }
 
 export default CountryService;
 

/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Langauge } from '@my-app/common/src/candidate/langauge.interface';
 import LangaugeModel from '../models/language.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class LangaugeService {
 
   public async findAllLangauge(): Promise<Langauge[]> {
     const langauges: Langauge[] = await LangaugeModel.find();
     return langauges;
   }

   public async getLangaugeIds(langauge: any): Promise<any> {
    let langaugeRes: any = await LangaugeModel.findOne({ title: { $regex: langauge, $options: 'i' } });
    if (!(langaugeRes && langaugeRes.title)) {
      langaugeRes = await LangaugeModel.create({ title: langauge } );
    }
    return langaugeRes;
  }

   public async findAllLangaugeByName(name: string): Promise<any[]> {
    const langauges = await LangaugeModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return langauges;
  }
 
   public async findLangaugeById(langaugeId: string): Promise<Langauge> {
     if (isEmpty(langaugeId)) throw new HttpException(400, "Langauge Id is required");
 
     const findLangauge: Langauge | null = await LangaugeModel.findOne({ _id: langaugeId }!);
     if (!findLangauge) throw new HttpException(409, "Langauge not found ");
 
     return findLangauge;
   }
 
   public async createLangauge(langaugeData: Langauge): Promise<Langauge> {
     if (isEmpty(langaugeData)) throw new HttpException(400, "Langauge data is required");
 
     const createLangaugeData:any = await LangaugeModel.create({ ...langaugeData });
 
     return createLangaugeData;
   }
 
   public async updateLangauge(langaugeId: string, langaugeData: Langauge): Promise<Langauge> {
     if (isEmpty(langaugeData)) throw new HttpException(400, "Langauge data is required");
 
     const updateLangaugeById: Langauge | null = await LangaugeModel.findByIdAndUpdate(langaugeId, langaugeData);
     if (!updateLangaugeById) throw new HttpException(409, "Failed to update langauge");
 
     return updateLangaugeById;
   }
 
   public async deleteLangauge(langaugeId: string): Promise<Langauge> {
     const deleteLangaugeById: Langauge | null = await LangaugeModel.findByIdAndDelete(langaugeId);
     if (!deleteLangaugeById) throw new HttpException(409, "Failed to delete langauge");
 
     return deleteLangaugeById;
   }
 }
 
 export default LangaugeService;
 

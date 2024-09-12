/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { PreviousSearch } from '@my-app/common/src/candidate/previous-search.interface';
 import PreviousSearchModel from '../models/previous-search.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class PreviousSearchService {
 
   public async findAllPreviousSearch(req: any): Promise<PreviousSearch[]> {
    console.log('Prev Search>>>>>>>>>>>', req);
    const sortKey = req.sort ? req.sort : { execution_at: -1 };
    const skipVal = req.skip ? req.skip : 0;
    const limitVal = req.limit ? req.limit : 5;
    var filter = {}
    if(req.filter) {
      filter = req.filter;
    }
     const previousSearches: PreviousSearch[] = await PreviousSearchModel.find(filter).sort(sortKey).skip(skipVal*limitVal).limit(limitVal);
     return previousSearches;
   }
 
   public async findPreviousSearchById(previousSearchId: string): Promise<PreviousSearch> {
     if (isEmpty(previousSearchId)) throw new HttpException(400, "You're not previousSearchId");
 
     const findPreviousSearch: PreviousSearch | null = await PreviousSearchModel.findOne({ _id: previousSearchId }!);
     if (!findPreviousSearch) throw new HttpException(409, "You're not previousSearchId");
 
     return findPreviousSearch;
   }
 
   public async createPreviousSearch(PreviousSearchData: PreviousSearch): Promise<PreviousSearch> {
     if (isEmpty(PreviousSearchData)) throw new HttpException(400, "You're not previous search");
 
     const previousSearchData:any = await PreviousSearchModel.create({ ...PreviousSearchData });
 
     return previousSearchData;
   }
 
   public async updatePreviousSearch(previousSearchId: string, previousSearchData: PreviousSearch): Promise<PreviousSearch> {
     if (isEmpty(previousSearchData)) throw new HttpException(400, "You're not previous search");
 
     const updatePreviousSearchById: PreviousSearch | null = await PreviousSearchModel.findByIdAndUpdate(previousSearchId, previousSearchData);
     if (!updatePreviousSearchById) throw new HttpException(409, "You're not previous search");
 
     return updatePreviousSearchById;
   }
 
   public async deletePreviousSearch(previousSearchId: string): Promise<PreviousSearch> {
     const deletePreviousSearchById: PreviousSearch | null = await PreviousSearchModel.findByIdAndDelete(previousSearchId);
     if (!deletePreviousSearchById) throw new HttpException(409, "You're not previous search");
 
     return deletePreviousSearchById;
   }
 }
 
 export default PreviousSearchService;
 

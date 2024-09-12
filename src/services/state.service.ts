/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { State } from '@my-app/common/src/candidate/state.interface';
 import StateModel from '../models/state.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class StateService {
 
   public async findAllState(filterObj:any): Promise<State[]> {
    console.log(filterObj)
     const states: State[] = await StateModel.find(filterObj);
     return states;
   }
 
   public async findStateById(stateId: string): Promise<State> {
     if (isEmpty(stateId)) throw new HttpException(400, "State Id is required");
 
     const findState: State | null = await StateModel.findOne({ _id: stateId }!);
     if (!findState) throw new HttpException(409, "State not found ");
 
     return findState;
   }
 
   public async createState(stateData: State): Promise<State> {
     if (isEmpty(stateData)) throw new HttpException(400, "State data is required");
 
     const createStateData:any = await StateModel.create({ ...stateData });
 
     return createStateData;
   }
 
   public async updateState(stateId: string, stateData: State): Promise<State> {
     if (isEmpty(stateData)) throw new HttpException(400, "State data is required");
 
     const updateStateById: State | null = await StateModel.findByIdAndUpdate(stateId, stateData);
     if (!updateStateById) throw new HttpException(409, "Failed to update State");
 
     return updateStateById;
   }
 
   public async deleteState(cityId: string): Promise<State> {
     const deleteStateById: State | null = await StateModel.findByIdAndDelete(cityId);
     if (!deleteStateById) throw new HttpException(409, "Failed to delete certificate");
 
     return deleteStateById;
   }
 }
 
 export default StateService;
 

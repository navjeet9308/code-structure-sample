/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { CandidatePermission } from '@my-app/common/src/candidate/candidate-permission.interface';
 import CandidatePermissionModel from '../models/candidate-permission.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CandidatePermissionService {
   public async findAllCandidatePermission(): Promise<CandidatePermission[]> {
     const candidatePermissiones: CandidatePermission[] = await CandidatePermissionModel.find();
     return candidatePermissiones;
   }
 
   public async findCandidatePermissionById(candidatePermissionId: string): Promise<CandidatePermission> {
     if (isEmpty(candidatePermissionId)) throw new HttpException(400, "Please provide candidate permission ID");
 
     const findCandidatePermission: CandidatePermission | null = await CandidatePermissionModel.findOne({ _id: candidatePermissionId }!);
     if (!findCandidatePermission) throw new HttpException(409, "No candidate permission found.");
 
     return findCandidatePermission;
   }
 
   public async createCandidatePermission(CandidatePermissionData: CandidatePermission): Promise<CandidatePermission> {
     if (isEmpty(CandidatePermissionData)) throw new HttpException(400, "Candidate permission data is required.");
 
     const candidatePermissionData:any = await CandidatePermissionModel.create({ ...CandidatePermissionData });
 
     return candidatePermissionData;
   }
 
   public async updateCandidatePermission(candidatePermissionId: string, candidatePermissionData: CandidatePermission): Promise<CandidatePermission> {
     if (isEmpty(candidatePermissionData)) throw new HttpException(400, "Candidate permission data is required.");
 
     const updateCandidatePermissionById: CandidatePermission | null = await CandidatePermissionModel.findByIdAndUpdate(candidatePermissionId, candidatePermissionData);
     if (!updateCandidatePermissionById) throw new HttpException(409, "Failed to update candidate permission.");
 
     return updateCandidatePermissionById;
   }
 
   public async deleteCandidatePermission(candidatePermissionId: string): Promise<CandidatePermission> {
     const deleteCandidatePermissionById: CandidatePermission | null = await CandidatePermissionModel.findByIdAndDelete(candidatePermissionId);
     if (!deleteCandidatePermissionById) throw new HttpException(409, "Fail to delete candidate permission.");
 
     return deleteCandidatePermissionById;
   }
 }
 
 export default CandidatePermissionService;
 

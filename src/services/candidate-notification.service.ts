/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { CandidateNotification } from '@my-app/common/src/candidate/candidate-notification.interface';
 import CandidateNotificationModel from '../models/candidate-notification.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CandidateNotificationService {
   public async findAllCandidateNotification(): Promise<CandidateNotification[]> {
     const candidateNotificationes: CandidateNotification[] = await CandidateNotificationModel.find();
     return candidateNotificationes;
   }
 
   public async findCandidateNotificationById(candidateNotificationId: string): Promise<CandidateNotification> {
     if (isEmpty(candidateNotificationId)) throw new HttpException(400, "Please provide candidate notification ID.");
 
     const findCandidateNotification: CandidateNotification | null = await CandidateNotificationModel.findOne({ _id: candidateNotificationId }!);
     if (!findCandidateNotification) throw new HttpException(409, "No candidate notification found.");
 
     return findCandidateNotification;
   }
 
   public async createCandidateNotification(CandidateNotificationData: CandidateNotification): Promise<CandidateNotification> {
     if (isEmpty(CandidateNotificationData)) throw new HttpException(400, "Candidate notification data is required.");
 
     const candidateNotificationData:any = await CandidateNotificationModel.create({ ...CandidateNotificationData });
 
     return candidateNotificationData;
   }
 
   public async updateCandidateNotification(candidateNotificationId: string, candidateNotificationData: CandidateNotification): Promise<CandidateNotification> {
     if (isEmpty(candidateNotificationData)) throw new HttpException(400, "Candidate notification data is required.");
 
     const updateCandidateNotificationById: CandidateNotification | null = await CandidateNotificationModel.findByIdAndUpdate(candidateNotificationId, candidateNotificationData);
     if (!updateCandidateNotificationById) throw new HttpException(409, "Failed to update candidate notification.");
 
     return updateCandidateNotificationById;
   }
 
   public async deleteCandidateNotification(candidateNotificationId: string): Promise<CandidateNotification> {
     const deleteCandidateNotificationById: CandidateNotification | null = await CandidateNotificationModel.findByIdAndDelete(candidateNotificationId);
     if (!deleteCandidateNotificationById) throw new HttpException(409, "Fail to delete candidate notification.");
 
     return deleteCandidateNotificationById;
   }
 }
 
 export default CandidateNotificationService;
 

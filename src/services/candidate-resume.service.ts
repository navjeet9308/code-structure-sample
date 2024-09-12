/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { CandidateResume } from '@my-app/common/src/candidate/candidate-resume.interface';
 import CandidateResumeModel from '../models/candidate-resume.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CandidateResumeService {
   public async findAllCandidateResume(whereObj:any): Promise<CandidateResume[]> {
     const CandidateResumes:any = await CandidateResumeModel.find(whereObj).sort({createdAt:-1});
     return CandidateResumes;
   }
 
   public async findCandidateResumeById(CandidateResumeId: string): Promise<CandidateResume> {
     if (isEmpty(CandidateResumeId)) throw new HttpException(400, "Please provide resume ID.");
 
     const findCandidateResume: CandidateResume | null = await CandidateResumeModel.findOne({ _id: CandidateResumeId }!);
     if (!findCandidateResume) throw new HttpException(409, "No record found.");
 
     return findCandidateResume;
   }
 
   public async createCandidateResume(CandidateResumeData: CandidateResume): Promise<CandidateResume> {
     if (isEmpty(CandidateResumeData)) throw new HttpException(400, "Resume data is required.");
 
     const candidateResumeData:any = await CandidateResumeModel.create({ ...CandidateResumeData });
 
     return candidateResumeData;
   }
 
   public async updateCandidateResume(CandidateResumeId: string, CandidateResumeData: CandidateResume): Promise<CandidateResume> {
     if (isEmpty(CandidateResumeData)) throw new HttpException(400, "Resume data is required.");
 
     const updateCandidateResumeById: CandidateResume | null = await CandidateResumeModel.findByIdAndUpdate(CandidateResumeId, CandidateResumeData);
     if (!updateCandidateResumeById) throw new HttpException(409, "Failed to update resume.");
 
     return updateCandidateResumeById;
   }
 
   public async deleteCandidateResume(CandidateResumeId: string): Promise<CandidateResume> {
     const deleteCandidateResumeById: CandidateResume | null = await CandidateResumeModel.findByIdAndDelete(CandidateResumeId);
     if (!deleteCandidateResumeById) throw new HttpException(409, "Failed to delete resume.");
 
     return deleteCandidateResumeById;
   }
   public async updateResume(personId: string, data: CandidateResume): Promise<CandidateResume> {
     const resumeUpdated: any = await CandidateResumeModel.updateOne({ person_id: personId }, data);
     if (!resumeUpdated) throw new HttpException(409, "Failed to update resume.");
     return resumeUpdated;
   }
 }
 
 export default CandidateResumeService;
 

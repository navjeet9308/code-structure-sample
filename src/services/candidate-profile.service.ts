/**
 * Service Methods
 */

import { HttpException } from '../exceptions/HttpException'
import { CandidateProfile } from '@my-app/common/src/candidate/candidate-profile.interface';
import CandidateProfileModel from '../models/candidate-profile.model';
import { isEmpty } from '../utils/utility';
// import { logger } from 'utils/logger';

import { Service, Container } from "typedi";
import IsgSyncService from '../services/isg-sync.service';
const isgService = Container.get(IsgSyncService);
@Service()
class CandidateProfileService {
  public async findAllCandidateProfile(): Promise<CandidateProfile[]> {
    const candidateProfiles: CandidateProfile[] = await CandidateProfileModel.find();
    return candidateProfiles;
  }

  public async findAllCandidateProfileWhere(filterObj: any): Promise<CandidateProfile[]> {
    const candidateProfiles: any = await CandidateProfileModel.findOne(filterObj);
    return candidateProfiles;
  }

  public async findCandidateProfileById(candidateProfileId: string): Promise<CandidateProfile> {
    if (isEmpty(candidateProfileId)) throw new HttpException(400, "Please provide profile ID.");

    const findCandidateProfile: CandidateProfile | null = await CandidateProfileModel.findOne({ _id: candidateProfileId }!);
    if (!findCandidateProfile) throw new HttpException(409, "No profile found.");

    return findCandidateProfile;
  }

  public async createCandidateProfile(CandidateProfileData: CandidateProfile): Promise<CandidateProfile> {
    if (isEmpty(CandidateProfileData)) throw new HttpException(400, "Profile data is required.");

    const candidateProfileData: any = await CandidateProfileModel.create({ ...CandidateProfileData });

    return candidateProfileData;
  }

  public async createSocialCandidateProfile(CandidateProfileData: any): Promise<any> {
    if (isEmpty(CandidateProfileData)) return "Profile data is required.";
    const candidateProfileData: any = await CandidateProfileModel.create({ ...CandidateProfileData });
    return candidateProfileData;
  }

  public async updateCandidateProfile(candidateProfileId: string, candidateProfileData: CandidateProfile): Promise<CandidateProfile> {
    if (isEmpty(candidateProfileData)) throw new HttpException(400, "Profile data is required.");
    const updateCandidateProfileById: CandidateProfile | null = await CandidateProfileModel.findByIdAndUpdate(candidateProfileId, candidateProfileData);
    if (!updateCandidateProfileById) throw new HttpException(409, "Failed to update profile.");

    return updateCandidateProfileById;
  }

  public async deleteCandidateProfile(candidateProfileId: string): Promise<CandidateProfile> {
    const deleteCandidateProfileById: CandidateProfile | null = await CandidateProfileModel.findByIdAndDelete(candidateProfileId);
    if (!deleteCandidateProfileById) throw new HttpException(409, "Failed to delete profile.");

    return deleteCandidateProfileById;
  }

  public async updateProfile(personId: string, data: CandidateProfile): Promise<CandidateProfile> {
    const resumeUpdated: any = await CandidateProfileModel.updateOne({ person_id: personId }, data);
    if (!resumeUpdated) throw new HttpException(409, "Failed to update profile.");
     /// need to work
    try {
      isgService.SyncTalentToIsg(data,personId)
    } catch (error) {
      // logger.debug("Error in sync service:CandidateProfileService:UpdateProfile", error)
    }
     return resumeUpdated;
  }
  public async updateSchemaProfile(id: string, data: any): Promise<CandidateProfile> {
    let whereObj = {};
    let profileData = {};
    if (data.operation === 'add') {
      whereObj = { _id: id };
      if (data.type === 'Education') {
        profileData = { '$push': { 'educations': data.educations } }
      }
      if (data.type === 'Experience') {
        profileData = { '$push': { 'employment_history': data.employment_history } }
      }
      if (data.type === 'Skill') {
        profileData = { '$push': { 'skills': data.skills } }
      }
      if (data.type === 'Certification') {
        profileData = { '$push': { 'certifications': data.certifications } }
      }
      if (data.type === 'Language') {
        profileData = { '$push': { 'languages': data.languages } }
      }
    } else {
      if (data.type === 'Education') {
        whereObj = { _id: id, 'educations.id': data.id }
        profileData = { '$set': { 'educations.$': data.educations } }
      }
      if (data.type === 'Experience') {
        whereObj = { _id: id, 'employment_history.id': data.id }
        profileData = { '$set': { 'employment_history.$': data.employment_history } }
      }
      if (data.type === 'Skill') {
        whereObj = { _id: id, 'skills.id': data.id }
        profileData = { '$set': { 'skills.$': data.skills } }
      }
      if (data.type === 'Certification') {
        whereObj = { _id: id, 'certifications.id': data.id }
        profileData = { '$set': { 'certifications.$': data.certifications } }
      }
      if (data.type === 'Language') {
        whereObj = { _id: id, 'languages.id': data.id }
        profileData = { '$set': { 'languages.$': data.languages } }
      }
    }
    const updateProfile: any = await CandidateProfileModel.updateOne(whereObj, profileData);
    if (!updateProfile) throw new HttpException(409, "Failed to update profile.");
    try{     
      const profile = await CandidateProfileModel.findOne({ _id: id }!)
      isgService.SyncTalentToIsg(data,profile?.person_id)    
    } catch (error) {
      // logger.debug("Error in sync service:CandidateProfileService:UpdateSchema", error)
    }    
    return updateProfile;
  }

  public async deleteData(id: string,childId: string, type: any) {
    let data = {};
    let  whereObj = { _id: id};
    if(type === 'Education') {
      data = { '$pull': { 'educations' : {'id': childId}}};
    }
    if (type === 'Experience') {
      data = { '$pull': { 'employment_history': {'id': childId} } }
    }
    if(type === 'Skill') {
      data = { '$pull': { 'skills' : {'id': childId}}};
    }
    if (type === 'Certification') {
      data = { '$pull': { 'certifications': {'id': childId} } }
    }
    if (type === 'Language') {
      data = { '$pull': { 'languages': {'id': childId} } }
    }
    if(data && Object.keys(data)){
      const updateProfile: any = await CandidateProfileModel.updateOne(whereObj,data);
      if (!updateProfile) throw new HttpException(409, "Failed to delete profile.");
      return updateProfile;
    }else{
      return false;
    }
    
  }
  public async updateProfileComplete(id: string, data: any): Promise<CandidateProfile> {
    let whereObj = { _id: id };
    let profileData = { '$push': { 'profile_completeness': data['profile_completeness'] },
    completeness_percentage:data['completeness_percentage'] };
    const updateProfile: any = await CandidateProfileModel.updateOne(whereObj, profileData);
    if (!updateProfile) throw new HttpException(409, "Failed to update profile.");
    return updateProfile;
  }
}

export default CandidateProfileService;


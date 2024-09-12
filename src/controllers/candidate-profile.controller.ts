import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { CandidateProfile } from '@my-app/common/src/candidate/candidate-profile.interface';
import CandidateProfileService from '../services/candidate-profile.service';
import PersonService from '../services/person.service';
import { Service } from "typedi";
@Service()
class CandidateProfileController {
  constructor(private readonly candidateProfileService: CandidateProfileService,
    private readonly personService: PersonService) { }

  public getCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCandidateProfilesData: CandidateProfile[] = await this.candidateProfileService.findAllCandidateProfile();
      res.status(200).json({ data: findAllCandidateProfilesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCandidateProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateProfileId: string = req.params.id;
      const findOneCandidateProfileData: CandidateProfile = await this.candidateProfileService.findCandidateProfileById(candidateProfileId);
      res.status(200).json({ data: findOneCandidateProfileData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateProfileData: any = req.body;
      const createCandidateProfileData: CandidateProfile = await this.candidateProfileService.createCandidateProfile(candidateProfileData);
      res.status(201).json({ data: createCandidateProfileData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateProfileId: string = req.params.id;
      const candidateProfileData: any = req.body;
      const updateCandidateProfileData: CandidateProfile = await this.candidateProfileService.updateCandidateProfile(candidateProfileId, candidateProfileData);
      res.status(200).json({ data: updateCandidateProfileData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateProfileId: string = req.params.id;
      const deleteCandidateProfileData: CandidateProfile = await this.candidateProfileService.deleteCandidateProfile(candidateProfileId);
      res.status(200).json({ data: deleteCandidateProfileData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public candidateProfileUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      const data: any = req.body;
      const personInfo = data.personBasicInfo;
      if(personInfo && Object.keys(personInfo)){
        this.personService.updatePerson(personId,personInfo);
      }
      delete data.personBasicInfo;
      const candidateInfo = {...data, ...personInfo};
      const updateCandidateProfileData: CandidateProfile = await this.candidateProfileService.updateProfile(personId, candidateInfo);
      res.status(200).json({ data: updateCandidateProfileData, message: 'updated' });
    } catch (error) {
      console.log('error',error)
      next(error);
    }
  };
  public updateProfileMetaData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataObj: any = req.body;
      const personId = req.params.id;
      const updateCandidateProfileData: CandidateProfile = await this.candidateProfileService.updateSchemaProfile(personId, dataObj);
      res.status(200).json({ data: updateCandidateProfileData, message: 'updated' });
    } catch (error) {
      console.log('error',error)
      next(error);
    }
  };
  public candidateProfileDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const childId: string = req.params.childId;
      const type: string = req.params.type;
      const deleteCandidateProfileData: CandidateProfile = await this.candidateProfileService.deleteData(id,childId,type);
      res.status(200).json({ data: deleteCandidateProfileData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public updateProfileCompleteness = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataObj: any = req.body;
      const personId = req.params.id;
      const updateProfileCompleteness: CandidateProfile = await this.candidateProfileService.updateProfileComplete(personId, dataObj);
      res.status(200).json({ data: updateProfileCompleteness, message: 'updated' });
    } catch (error) {
      console.log('error',error)
      next(error);
    }
  };
  
}

export default CandidateProfileController;

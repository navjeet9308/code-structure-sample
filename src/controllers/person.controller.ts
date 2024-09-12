import { NextFunction, Request, Response } from 'express';
import { Person } from '@my-app/common/src/candidate/person.interface';
import { CandidateProfile } from '@my-app/common/src/candidate/candidate-profile.interface';
import PersonService from '../services/person.service';
import CandidateProfileService from '../services/candidate-profile.service';
import CandidateResumeService from '../services/candidate-resume.service';
import IsgSyncService from '../services/isg-sync.service';
import { Service, Container } from "typedi";
import {  JOB_BOARD_ID, JOB_BOARD_NAME, CANDIDATE_TYPE_ID } from "./../config";
import SalesforceApiService from '../services/sf-composite-api.service';
// import { logger } from 'utils/logger';

const crypto = require('crypto');
const isgService = Container.get(IsgSyncService);

@Service()
class PersonController {
  constructor(private readonly personService: PersonService,
    private readonly candidateProfileService: CandidateProfileService,
    private readonly candidateResumeService: CandidateResumeService) { }

  public getPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPersonsData: Person[] = await this.personService.findAllPerson();
      res.status(200).json({ data: findAllPersonsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getPersonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      let findOnePersonData: Person = await this.personService.findPersonById(personId);
      if(findOnePersonData){
        res.status(200).json({ data: findOnePersonData, message: 'findOne' });
      }else{
        res.status(200).json({ data: [], message: 'findOne' });
      }
    } catch (error) {
      next(error);
    }
  };
  public getPersonAllById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      let findOnePersonData: Person = await this.personService.findPersonById(personId);
      if(findOnePersonData){
        const candidateProfile: CandidateProfile[] = await this.candidateProfileService.findAllCandidateProfileWhere({person_id:personId});
        res.status(200).json({ data: findOnePersonData, profile: candidateProfile, message: 'findOne' });
      }else{
        res.status(200).json({ data: [], message: 'findOne' });
      }
    } catch (error) {
      next(error);
    }
  };

  public createPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personData: any = req.body;
      const createPersonData: Person = await this.personService.createPerson(personData);
      res.status(201).json({ data: createPersonData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };


  public socialSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personData: any = req.body;
      let person_id;
      const existPerson = await this.personService.checkPersonByEmailForResumeParser(personData.email);
      if (existPerson) {
        person_id = existPerson['_id'];
      } else {
        const commonPayload = {
          full_name: personData.full_name,
          email: personData.email,
          phone: personData.phone,
          gender: personData.gender,
          sfdc_id: personData.sfdc_id,
          picture: personData.picture
        };
        const personPayload = {
          ...commonPayload,
          ...{
            socialAuthSub: personData.socialAuthSub,
            linkedLoginIn: personData.linkedLoginIn,
            googleLoginIn: personData.googleLoginIn,
            verify_email: personData.verify_otp,
            verify_otp: personData.verify_otp,
            otp: personData.otp         
          }
        }
        const createPerson: any = await this.personService.createSocialPerson(personPayload);
        person_id = createPerson['_id'];

        const candidateProfilePayload = {
          ...commonPayload,
          ...{
            person_id: person_id,
            completeness_percentage: 15,
            profile_completeness: {
              category: "Personal Information",
              weightage: 25,
              is_complete: true,
              candidate_id: person_id
            },
            jobboard_source:  {
              jobboard_id: JOB_BOARD_ID,
              jobboard_name: JOB_BOARD_NAME,
              person_id: person_id,
              sfdcId: JOB_BOARD_ID
            }
          }
        }
        this.candidateProfileService.createSocialCandidateProfile(candidateProfilePayload);
        try{
          isgService.SyncTalentToIsg(candidateProfilePayload, person_id)
        } catch (error) {
          // logger.debug("Error in sync service:PersonCOntroller:SocialSignup", error)
        }
      }
      res.status(201).json({ data: { person_id: person_id }, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  

  public updatePerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      const personData: any = req.body;
      const updatePersonData: Person = await this.personService.updatePerson(personId, personData);
      res.status(200).json({ data: updatePersonData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      const deletePersonData: Person = await this.personService.deletePerson(personId);
      res.status(200).json({ data: deletePersonData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public emailExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: any = req.body && req.body.email ? req.body.email : '';
      const count: Number = await this.personService.countPerson({email:email});
      res.status(201).json({ data: count, message: 'email exist' });
    } catch (error) {
      next(error);
    }
  };

  public sentEmailOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: any = req.body && req.body.email ? req.body.email : '';
      const emailExistData: Person = await this.personService.sentEmailOtp(email);
      res.status(201).json({ data: emailExistData, message: 'email sent' });
    } catch (error) {
      next(error);
    }
  };

  public validateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      const otp: any = req.body && req.body.otp ? req.body.otp : '';
      const otpData: Person = await this.personService.matchOtp(personId,otp);
      res.status(201).json({ data: otpData, message: 'OTP match' });
    } catch (error) {
      next(error);
    }
  };
  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId: string = req.params.id;
      const personData: any = req.body;
      const changedPassword: Person = await this.personService.changePassword(personId, personData);
      res.status(201).json({ data: changedPassword, message: 'Password changed successfully.' });
    } catch (error) {
      next(error);
    }
  }; 
  public signUpOld = async (req: any, res: any, next: NextFunction) => {
    try {
      let personData: any = req.body;
      res.status(201).json({ data: personData, message: 'Thank you for registering with us, please check your email.' });
    }catch (error) {
      console.log('error',error)
      next(error);
    }
  };

  public signUp = async (req: any, res: any, next: NextFunction) => {
    try {
      let personData: any = this.prepairPersonData(req);
      const email = personData.email;
      const oldPassword = personData.password;
      delete personData.password;
      let otp = Math.floor(100000 + Math.random() * 900000);
      personData['otp'] = otp;
      let candidateProfile = {};
      if(personData.candidateProfile){
        candidateProfile = personData.candidateProfile;
        delete personData.candidateProfile;
      }
      //to check if user is alredy exist
      const personExist: number = await this.personService.countPerson({email:email});
      if (personExist > 0) {
        res.status(201).json({ data: personExist, message: 'User with ' + email + ' is already register with us.' });
      } else {
        // Person ISG HTTPS SFDCID
        const personSFData = this.prepairSfContact(personData);
        console.log('-------------Create Contact Application On SF----------', new Date())
        const sfResponse: any = await SalesforceApiService.fetchSFCompositeAPIService('Contact', personSFData);
        console.log('-------------Create END Contact On SF----------', new Date())
        if (sfResponse && sfResponse.compositeResponse[0] && sfResponse.compositeResponse[0].body) {
          console.log('Contact sfResponse::', sfResponse.compositeResponse[0].body);
          personData['sfdc_id'] = sfResponse.compositeResponse[0].body.id;
        }
        const createPersonData: any = await this.personService.createPerson(personData);
        if (createPersonData && createPersonData['id']) {         
          const personId = createPersonData['id'];
          personData['person_id'] = personId;
          const authPayload = {...personData, ...{password: oldPassword}}
          console.log('Create Auth0 User::', new Date());
          this.personService.createAuth0User(authPayload);
          candidateProfile = this.prepairCandidateProfile(candidateProfile, personId);
          if (req.file) {
            const resumeParserResponse = await this.uploadFile(req, personId, email);
            candidateProfile = {...candidateProfile, ... { latest_resume: resumeParserResponse.fileName ? resumeParserResponse.fileName : '' }}
          }

          // Create Candidate Profile
          await this.createCandidateProfile(candidateProfile, personData);
          //send Otp email to register user
          this.sendOtpEmail(personData, otp);
          try {
            console.log("Person Id Before Sending", personId)
              isgService.SyncTalentToIsg(personData, personId)  
          } catch (error) {
              // logger.debug("Error in sync service:PersonController:Signup", error)
          }
          
          res.status(201).json({ data: createPersonData, message: 'Thank you for registering with us, please check your email.' });
        } else {
          res.status(500).json({ message: 'Please try again later...' });
        }
      }
    } catch (error) {
      next(error);
    }
  }; 
  public prepairPersonData = (req: any) => {
    return {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    };
  }

  public prepairSfContact = (personData:any) => {
    let names = personData.full_name ? personData.full_name.split(" ") : [];
    const eName = personData["email"] ? personData["email"].split("@") : [];
    names = names.length ? names : eName;
    const firstName = names[0];
    let lastName = names[names.length - 1];
    lastName = lastName ? lastName : firstName;
    return { 
      LastName: lastName,
      FirstName: firstName,
      RecordTypeId: CANDIDATE_TYPE_ID,
      Email: personData.email,
      Email__c: personData.email,
      Phone: personData.phone ? personData.phone : "",
      Source__c: JOB_BOARD_ID,
     }
  }

  public prepairCandidateProfile = (candidateProfile: any, personId: any) => {
   return {
      ...candidateProfile,
      ... {
        person_id: personId,
        jobboard_source: {
          jobboard_id: JOB_BOARD_ID,
          jobboard_name: JOB_BOARD_NAME,
          person_id: personId,
          sfdcId: JOB_BOARD_ID
        }
      }
    }
  }
  public uploadFile = async (req: any, personId: any, email: any) => {
    console.log('Parser Resume Api::', new Date());
    this.personService.parserResumeApi(req.file, { _id: personId, email: email }) // Create 
    const resumeResponse: any = await this.personService.uploadFile(req.file, { _id: personId });
    if (resumeResponse) {
      const uploadCandidateResume: any = {
        person_id: personId,
        url: resumeResponse.fileName,
        fileMeta: req.file
      }
      console.log('Create Candidate Resume::', new Date());
     this.candidateResumeService.createCandidateResume(uploadCandidateResume);
     return resumeResponse
    }
  }

  public createCandidateProfile = async (candidateProfile: any, personData: any) => {     
    console.log('Create Candidate Profile::', new Date());
    const {full_name, email, phone } = personData;
    candidateProfile = {
      ...candidateProfile,
      ... {
        full_name: full_name,
        email: email,
        phone: phone,
        completeness_percentage: 15,
        profile_completeness: {
          category: "Personal Information",
          weightage: 25,
          is_complete: true,
          candidate_id: candidateProfile.person_id
        }
      }
    }
    await this.candidateProfileService.createCandidateProfile(candidateProfile);
  }

  public  sendOtpEmail = async (personData: any, otp: number) => {
    const emailReq = {
      email: personData['email'],
      template: 'user-otp',
      subject: 'Serviceo Talent Portal Verification OTP',
      otp: otp,
      name: personData['full_name']
    }
    console.log('Send otp email::', new Date());
    const emailSend = await this.personService.sendEmail(emailReq);
    return emailSend;
  }

  public uploadResume = async (req: any, res: any, next: NextFunction) => {
    try {
      let personId: any = req.params.id;
      // upload resume to s3 bucket
      const resumeUploaded:any = await this.personService.uploadFile(req.file,{_id:personId});
      if(resumeUploaded){
        const updateCandidateProfile: any = { latest_resume: resumeUploaded.fileName }
        this.candidateProfileService.updateProfile(personId, updateCandidateProfile);         
        const uploadCandidateResume: any = {
          person_id: personId,
          url: resumeUploaded.fileName,
          fileMeta: req.file
        }
       this.candidateResumeService.createCandidateResume(uploadCandidateResume);
      }
      res.status(201).json({ data: resumeUploaded, message: 'resume updated successfully.' });
    } catch (error) {
      next(error);
    }
  };
  public getPersonByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: any = req.body && req.body.email ? req.body.email : '';
      // console.log('getPersonByEmail',email)
      const personData:any = await this.personService.checkPerson(email);
      res.status(201).json({ data: personData, message: 'email exist' });
    } catch (error) {
      next(error);
    }
  };
  public getPersonLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: any = req.body && req.body.email ? req.body.email : '';
      const password: any = req.body && req.body.email ? req.body.password : '';
      const personData = await this.personService.login(email , password);
      res.status(201).json({ data: personData, message: 'login successfully.' });
    } catch (error) {
      next(error);
    }
  };
  public uploadProfilePicture = async (req: any, res: any, next: NextFunction) => {
    try {
      let personId: any = req.params.id;
      // upload resume to s3 bucket
      const resumeUploaded:any = await this.personService.uploadFile(req.file,{_id:personId});
      if(resumeUploaded){
        const personPicture: any = {
          picture : resumeUploaded.fileName
        }
        this.personService.updatePerson(personId,personPicture);
      }
      res.status(201).json({ data: resumeUploaded, message: 'resume updated successfully.' });
    } catch (error) {
      next(error);
    }
  };
}

export default PersonController;

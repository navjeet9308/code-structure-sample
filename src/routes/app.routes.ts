import { Router } from 'express';
import SampleController from '../controllers/sample.controller';
import { Routes } from '@my-app/common/src/routes/routes.interface';
import CandidateNotificationController from '../controllers/candidate-notification.controller';
import CandidatePermissionService from '../controllers/candidate-permission.controller';
import CandidateProfileController from '../controllers/candidate-profile.controller';
import JobAgentController from '../controllers/job-agent.controller';
import JobApplicationCommunicationController from '../controllers/job-application-communication.controller';
import JobApplicationController from '../controllers/job-application.controller';
import JobOfferController from '../controllers/job-offer.controller';
import PersonController from '../controllers/person.controller';
import PreviousSearchController from '../controllers/previous-search.controller';
import ScheduleJobController from '../controllers/schedule-job.controller';
import JobCaqController from '../controllers/job-caq.controller';
import ElasticSearchController from '../controllers/elastic-search.controller';
import CountryController from '../controllers/country.controller';
import StateController from '../controllers/state.controller';
import CityController from '../controllers/city.controller';
import LanguageController from '../controllers/language.controller';
import EducationalInstituteController from '../controllers/education-institute.controller';
import OrganizationController from '../controllers/organization.controller';
import CertificationController from '../controllers/certification.controller';
import SkillController from '../controllers/skill.controller';
import EducationalDegreeController from '../controllers/educational-degree.controller';
import SaveJobController from "../controllers/job-save.controller";
import CandidateResumeController from '../controllers/candidate-resume.controller';
import PasscodeController from '../controllers/passcode.controller';

import * as dotenv from "dotenv";

dotenv.config();
import 'reflect-metadata';
import { Container  } from "typedi";
const multer  = require('multer');
const upload = multer({ }); //  dest: 'uploads/'
class AppRoute implements Routes {
  public path = '/';
  public router = Router();
  public sampleController = new SampleController();
  public candidateNotificationController = Container.get(CandidateNotificationController);
  public candidatePermissionController  = Container.get(CandidatePermissionService);
  public candidateProfileController = Container.get(CandidateProfileController);
  public personController = Container.get(PersonController);
  public jobAgentController = Container.get(JobAgentController);
  public jobApplicationCommunicationController = Container.get(JobApplicationCommunicationController);
  public jobApplicationController = Container.get(JobApplicationController);
  public jobOfferController = Container.get(JobOfferController);
  public previousSearchController = Container.get(PreviousSearchController);
  public scheduleJobController = Container.get(ScheduleJobController);
  public JobCaqController = Container.get(JobCaqController);
  public elasticSearchController = Container.get(ElasticSearchController);
  public countryController = Container.get(CountryController);
  public stateController = Container.get(StateController);
  public cityController = Container.get(CityController);
  public languageController = Container.get(LanguageController);
  public educationalInstituteController = Container.get(EducationalInstituteController);
  public organizationController = Container.get(OrganizationController);
  public certificationController = Container.get(CertificationController);
  public skillController = Container.get(SkillController);
  public educationalDegreeController = Container.get(EducationalDegreeController);
  public saveJobController = Container.get(SaveJobController);
  public candidateResumeController = Container.get(CandidateResumeController);
  public passcodeController =  Container.get(PasscodeController);
  
  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.sampleController.getSamples);
    this.router.get(`${this.path}/:id`, this.sampleController.getSampleById);
    this.router.post(`${this.path}`, this.sampleController.createSample);
    this.router.put(`${this.path}/:id`, this.sampleController.updateSample);
    this.router.delete(`${this.path}/:id`, this.sampleController.deleteSample);
    this.router.get(`${this.path}candidateNotification/list`, this.candidateNotificationController.getCandidateNotification);
    this.router.get(`${this.path}candidateNotification/:id`, this.candidateNotificationController.getCandidateNotificationById);
    this.router.post(`${this.path}candidateNotification/create`, this.candidateNotificationController.createCandidateNotification);
    this.router.put(`${this.path}candidateNotification/:id`, this.candidateNotificationController.updateCandidateNotification);
    this.router.delete(`${this.path}candidateNotification/:id`, this.candidateNotificationController.deleteCandidateNotification);

    this.router.get(`${this.path}candidatePermission/list`, this.candidatePermissionController.getCandidatePermission);
    this.router.get(`${this.path}candidatePermission/:id`, this.candidatePermissionController.getCandidatePermissionById);
    this.router.post(`${this.path}candidatePermission/create`, this.candidatePermissionController.createCandidatePermission);
    this.router.put(`${this.path}candidatePermission/:id`, this.candidatePermissionController.updateCandidatePermission);
    this.router.delete(`${this.path}candidatePermission/:id`, this.candidatePermissionController.deleteCandidatePermission);
    //User Profile is candidate profile
    this.router.get(`${this.path}candidateProfile/list`, this.candidateProfileController.getCandidateProfile);
    this.router.get(`${this.path}candidateProfile/:id`, this.candidateProfileController.getCandidateProfileById);
    this.router.post(`${this.path}candidateProfile/create`, this.candidateProfileController.createCandidateProfile);
    this.router.put(`${this.path}candidateProfile/:id`, this.candidateProfileController.updateCandidateProfile);
    this.router.delete(`${this.path}candidateProfile/:id`, this.candidateProfileController.deleteCandidateProfile);
    this.router.put(`${this.path}candidateProfileUpdate/:id`, this.candidateProfileController.candidateProfileUpdate);
    this.router.put(`${this.path}updateSingleCandidateProfile/:id`, this.candidateProfileController.updateProfileMetaData);
    this.router.delete(`${this.path}candidateProfileDelete/:type/:id/:childId`, this.candidateProfileController.candidateProfileDelete);
    this.router.put(`${this.path}candidateProfile/completeness/:id`, this.candidateProfileController.updateProfileCompleteness);

    this.router.get(`${this.path}person/list`, this.personController.getPerson);
    this.router.get(`${this.path}person/:id`, this.personController.getPersonAllById);
    this.router.get(`${this.path}person/candidate/:id`, this.personController.getPersonAllById);
    this.router.post(`${this.path}person/create`, this.personController.createPerson);
    this.router.post(`${this.path}person/socialSignup`, this.personController.socialSignup);
    this.router.post(`${this.path}person/signUp`, upload.single('file_name'), this.personController.signUp); 
    this.router.put(`${this.path}person/uploadResume/:id`, upload.single('file_name'), this.personController.uploadResume); 
    this.router.put(`${this.path}person/uploadPicture/:id`, upload.single('file_name'), this.personController.uploadProfilePicture);       
    this.router.put(`${this.path}person/:id`, this.personController.updatePerson);
    this.router.delete(`${this.path}person/:id`, this.personController.deletePerson);
    this.router.post(`${this.path}person/emailExist`, this.personController.emailExist);
    this.router.post(`${this.path}person/sentEmailOtp`, this.personController.sentEmailOtp);
    this.router.put(`${this.path}person/validateOtp/:id`, this.personController.validateOtp);
    this.router.put(`${this.path}person/changePassword/:id`, this.personController.changePassword);
    this.router.post(`${this.path}person/userInfo`, this.personController.getPersonByEmail);
    this.router.post(`${this.path}person/login`, this.personController.getPersonLogin);

    this.router.get(`${this.path}jobAgent/list`, this.jobAgentController.getJobAgent);
    this.router.get(`${this.path}jobAgent/:id`, this.jobAgentController.getJobAgentById);
    this.router.post(`${this.path}jobAgent/create`, this.jobAgentController.createJobAgent);
    this.router.put(`${this.path}jobAgent/:id`, this.jobAgentController.updateJobAgent);
    this.router.delete(`${this.path}jobAgent/:id`, this.jobAgentController.deleteJobAgent);

    this.router.get(`${this.path}jobApplicationCommunication/list`, this.jobApplicationCommunicationController.getJobApplicationCommunication);
    this.router.get(`${this.path}jobApplicationCommunication/:id`, this.jobApplicationCommunicationController.getJobApplicationCommunicationById);
    this.router.post(`${this.path}jobApplicationCommunication/create`, this.jobApplicationCommunicationController.createJobApplicationCommunication);
    this.router.put(`${this.path}jobApplicationCommunication/:id`, this.jobApplicationCommunicationController.updateJobApplicationCommunication);
    this.router.delete(`${this.path}jobApplicationCommunication/:id`, this.jobApplicationCommunicationController.deleteJobApplicationCommunication);
    
    this.router.get(`${this.path}jobApplication/list`, this.jobApplicationController.getJobApplication);
    this.router.get(`${this.path}jobApplication/:id`, this.jobApplicationController.getJobApplicationById);
    this.router.post(`${this.path}jobApplication/create`, this.jobApplicationController.createJobApplication);
    this.router.put(`${this.path}jobApplication/:id`, this.jobApplicationController.updateJobApplication);
    this.router.delete(`${this.path}jobApplication/:id`, this.jobApplicationController.deleteJobApplication);
    this.router.put(`${this.path}getApplications`, this.jobApplicationController.getApplications);
    this.router.post(`${this.path}jobApplication/sendCAQEmail`, this.jobApplicationController.sentCAQEmail);

    this.router.get(`${this.path}jobOffer/list`, this.jobOfferController.getJobOffer);
    this.router.get(`${this.path}jobOffer/:id`, this.jobOfferController.getJobOfferById);
    this.router.post(`${this.path}jobOffer/create`, this.jobOfferController.createJobOffer);
    this.router.put(`${this.path}jobOffer/:id`, this.jobOfferController.updateJobOffer);
    this.router.delete(`${this.path}jobOffer/:id`, this.jobOfferController.deleteJobOffer);

    this.router.post(`${this.path}previousSearch/list`, this.previousSearchController.getPreviousSearch);
    this.router.get(`${this.path}previousSearch/:id`, this.previousSearchController.getPreviousSearchById);
    this.router.post(`${this.path}previousSearch/create`, this.previousSearchController.createPreviousSearch);
    this.router.put(`${this.path}previousSearch/:id`, this.previousSearchController.updatePreviousSearch);
    this.router.delete(`${this.path}previousSearch/:id`, this.previousSearchController.deletePreviousSearch);

    this.router.get(`${this.path}scheduleJob/list`, this.scheduleJobController.getScheduleJob);
    this.router.get(`${this.path}scheduleJob/:id`, this.scheduleJobController.getScheduleJobById);
    this.router.post(`${this.path}scheduleJob/create`, this.scheduleJobController.createScheduleJob);
    this.router.put(`${this.path}scheduleJob/:id`, this.scheduleJobController.updateScheduleJob);
    this.router.delete(`${this.path}scheduleJob/:id`, this.scheduleJobController.deleteScheduleJob);
    //job CAQ
    this.router.get(`${this.path}JobCaq/list`, this.JobCaqController.getJobCaq);
    this.router.get(`${this.path}JobCaq/:id`, this.JobCaqController.getJobCaqById);
    this.router.post(`${this.path}JobCaq/create`, this.JobCaqController.createJobCaq);
    this.router.put(`${this.path}JobCaq/:id`, this.JobCaqController.updateJobCaq);
    this.router.delete(`${this.path}JobCaq/:id`, this.JobCaqController.deleteJobCaq);
    // Elastic Search Router
    this.router.get(`${this.path}job/:id`, this.elasticSearchController.jobById);
    this.router.post(`${this.path}job/search`, this.elasticSearchController.jobSearch);
    this.router.post(`${this.path}job/create`, this.elasticSearchController.createjob);
    this.router.delete(`${this.path}job/:id`, this.elasticSearchController.deleteJob);

    // language , country and state list
    this.router.get(`${this.path}country/all`, this.countryController.getCountry);
    this.router.get(`${this.path}langauge/list`, this.languageController.getLanguageByName);
    this.router.get(`${this.path}country/list`, this.countryController.getCountryByName);
    this.router.get(`${this.path}state/list`, this.stateController.getState);
    this.router.get(`${this.path}education/list`, this.educationalInstituteController.getEducationalInstituteByName);
    this.router.get(`${this.path}organization/list`, this.organizationController.getOrganizationByName);
    this.router.get(`${this.path}skill/list`, this.skillController.getSkillByName);
    this.router.get(`${this.path}certification/list`, this.certificationController.getCertificationByName);
    //
    this.router.get(`${this.path}qualification/list`, this.educationalDegreeController.getEducationalDegree);
    this.router.get(`${this.path}qualification/:id`, this.educationalDegreeController.getEducationalDegreeById);
    this.router.post(`${this.path}qualification/create`, this.educationalDegreeController.createEducationalDegree);
    this.router.put(`${this.path}qualification/:id`, this.educationalDegreeController.updateEducationalDegree);
    this.router.delete(`${this.path}qualification/:id`, this.educationalDegreeController.deleteEducationalDegree);
    //Save Jobs
    this.router.post(`${this.path}saveJob/list`, this.saveJobController.getData);
    this.router.get(`${this.path}saveJob/:id`, this.saveJobController.getDataById);
    this.router.post(`${this.path}saveJob/create`, this.saveJobController.createData);
    this.router.put(`${this.path}saveJob/:id`, this.saveJobController.updateData);
    this.router.delete(`${this.path}saveJob/:id`, this.saveJobController.deleteData);
    //list of candidate resume
    this.router.get(`${this.path}candidate-resume/:persion_id`, this.candidateResumeController.getCandidateResume);
    this.router.post(`${this.path}passcode/validate`, this.passcodeController.validatePasscode);
  }
}

export default AppRoute;
 /**
 * Router Definition
 */

/**
 * Controller Definitions
 */

// GET items

// GET items/:id

// POST items

// PUT items/:id

// DELETE items/:id

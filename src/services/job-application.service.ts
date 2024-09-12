/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { JobApplication } from '@my-app/common/src/candidate/job-application.interface';
 import JobApplicationModel from '../models/job-application.model';
 import PersonModel from '../models/person.model';
 import PasscodeModel from '../models/passcode.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 import SalesforceApiService from './sf-composite-api.service';
 const envVar = require("../config");

 var mailer = require('../lib/mailer');
 @Service()
 class JobApplicationService {
 
   public async findAllJobApplication(): Promise<JobApplication[]> {
     const jobApplicationes: JobApplication[] = await JobApplicationModel.find();
     return jobApplicationes;
   }
 
   public async findJobApplicationById(jobApplicationId: string): Promise<JobApplication> {
     if (isEmpty(jobApplicationId)) throw new HttpException(400, "You're not jobApplicationId");
 
     const findJobApplication: JobApplication | null = await JobApplicationModel.findOne({ _id: jobApplicationId }!);
     if (!findJobApplication) throw new HttpException(409, "You're not jobApplicationId");
 
     return findJobApplication;
   }
 
   public async createJobApplication(JobApplicationData: any): Promise<JobApplication> {
     if (!(JobApplicationData && JobApplicationData.candidate_sfdcId)) throw new HttpException(400, "Candidate sfdcId required!");
     let salesforceObjData = {
      'RecordTypeId': envVar.APPLICATION_RECORD_TYPE,
      'Job__c': JobApplicationData['job_order_id'],
      'Candidate_Contact__c': JobApplicationData['candidate_sfdcId'],
      'Hiring_Manager__c': JobApplicationData['hiring_manager'], 
      'Secondary_Recruiter__c':JobApplicationData['secondary_recruiter'],
      'Right_to_Represent__c':'Yes',
      'Apply_Agency__c':false,
      'CreatedBy__c':JobApplicationData['candidate_sfdcId'],
      'Application_Source__c':'',
      'Stage__c':'Application',
      'Status__c':'New',
      'Custom_Price__c':false,
      //'Employment_Type__c':'Vendor'
     }
     const sfResponse:any = await SalesforceApiService.fetchSFCompositeAPIService('Application__c', salesforceObjData);
     console.log('-------------Create Application On SF----------')
     let jobApplicationData:any = [];
     if(sfResponse && sfResponse.compositeResponse[0] && sfResponse.compositeResponse[0].body){
      console.log('sfResponse::', sfResponse.compositeResponse[0].body);
      JobApplicationData['sfdc_id'] = sfResponse.compositeResponse[0].body.id ;
      jobApplicationData = await JobApplicationModel.create({ ...JobApplicationData });
      console.log('Application Response::', sfResponse.compositeResponse[0].body);
      return jobApplicationData;
     }else{
      return sfResponse;
     }
     
   }
 
   public async updateJobApplication(jobApplicationId: string, jobApplicationData: JobApplication): Promise<JobApplication> {
     if (isEmpty(jobApplicationData)) throw new HttpException(400, "You're not previous search");
 
     const updateJobApplicationById: JobApplication | null = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, jobApplicationData);
     if (!updateJobApplicationById) throw new HttpException(409, "You're not previous search");
 
     return updateJobApplicationById;
   }
 
   public async deleteJobApplication(jobApplicationId: string): Promise<JobApplication> {
     const deleteJobApplicationById: JobApplication | null = await JobApplicationModel.findByIdAndDelete(jobApplicationId);
     if (!deleteJobApplicationById) throw new HttpException(409, "You're not previous search");
 
     return deleteJobApplicationById;
   }
   public async findApplications(filterObj:any): Promise<JobApplication[]> {
    const jobApplicationes: JobApplication[] = await JobApplicationModel.find(filterObj);
    return jobApplicationes;
  }
  public async sendCAQEmail(data: any): Promise<any> {
    if (isEmpty(data)) throw new HttpException(400, "Please provide data.");
    let applicationData: any | null = await JobApplicationModel.findOne({ sfdc_id: data.appSfdcId });
    console.log('::::applicationData::', applicationData);
    if (applicationData && applicationData.sfdc_id) {   
      const name = applicationData['guest_full_name']
      const nameCaps = name.toLowerCase().replace(/\b[a-z]/g, function (letter: any) {
        return letter.toUpperCase();
      });
      const min = 111111;
      const max = 999999;
      const userObj = {
        url:data.url,
        subject:'Caq form submission',
        full_name: nameCaps,
        email: applicationData['guest_email'], 
        passcode:Math.floor(Math.random() * (max - min + 1) + min)
      }
      // save passcode in db 
      const validityInMin = 1440; //additional time
      let expireDate = new Date();
      expireDate.setMinutes(validityInMin);
      const passcode = {
        person_id:applicationData['applied_by_candidate'],
        code:userObj['passcode'],
        expireAt:expireDate,
        references:{
          app_name:applicationData['name'],
          app_sfdc_id:applicationData['sfdc_id'],
          que_set:data.queSet,
          que_name:data.queName,
          job_name:data.jobName,
          job_title:data.jobTitle,
          candidate_name:applicationData['guest_full_name']
        }
      }
      // save passcode for future use
      this.savePasscode(passcode , userObj);
    } 
    
  }
  public async savePasscode(passcode:any , userObj:any){
    const result:any = await PasscodeModel.create({ ...passcode });
    if(result){
      // send email to user/candidate
      var eMailObj = {
        from: 'noreply@serviceo.com',
        to: userObj['email'],
        template: 'caq',
        params: {
          ctx: userObj
        }
      };
      const email = await mailer.send(eMailObj);
      return email;
    }
  }
 }
 
 export default JobApplicationService;
 

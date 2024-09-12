/**
 * Service Methods
 */

import { Service } from "typedi";
import PersonService from "./person.service";
import OrganizationService from "./organization.service";
import LangaugeService from "./language.service";
import CandidateProfileService from "./candidate-profile.service";
import axios from "axios"
const aws = require('aws-sdk');
const { random } = require('lodash');
import PersonModel from "../models/person.model";
import CandidateProfileModel from "../models/candidate-profile.model";
import IsgSyncService from "./isg-sync.service";
import { META_DATA_BASE_URL, JOB_BOARD_ID, JOB_BOARD_NAME, SQS_ACCESSKEY, SQS_SECRETKEY, SQS_REGION, AWS_TALENT_RESUME_TO_SERVICEO_SQS_URL, AWS_CANDIDATE_S3_BUCKET_BASE_URL, CANDIDATE_TYPE_ID } from "./../config";
import CandidateResumeService from "./candidate-resume.service";
import SalesforceApiService from './sf-composite-api.service';
import EducationalDegreeService from "./educational-degree.service";
import CertificationService from "./certification.service";
const sqs = new aws.SQS({
  apiVersion: '2021-11-24',
  accessKeyId: SQS_ACCESSKEY,
  secretAccessKey: SQS_SECRETKEY,
  region: SQS_REGION
});
@Service()
class AIParserSyncService {
  constructor(private readonly personService: PersonService,
    private readonly candidateProfileService: CandidateProfileService,
    private readonly organizationService: OrganizationService,
    private readonly langaugeService: LangaugeService,
    private readonly candidateResumeService: CandidateResumeService,
    private readonly educationalDegreeService: EducationalDegreeService,
    private readonly certificationService: CertificationService,
    private readonly isgService: IsgSyncService) { }

  public async SyncToTalent(message: any) {
    const body = this.parseMessage(message)
    if (body["email"]) {
      console.log("----------New Message AI Parser Sqs---------", body["email"])
      await this.createUpdatePerson(body)
    } else {
      console.log("----------Email not enabled for Resume Parser------", body["full_name"])
    }
  }

  parseMessage(message: any) {
    let body = JSON.parse(message['Body']);
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }
    return body
  }

  async createUpdatePerson(contactData: any) {
    try {
    const resumeData = await this.prepairResumeParseData(contactData);
    // console.log("prepairResumeParseData::", resumeData)
    var globalPersonId;
    var globalSfdcId = '';
    const existPerson: any = await this.candidateProfileService.findAllCandidateProfileWhere({ email: contactData["email"] });
    if (existPerson) {
      console.log("----------Person Exists for AI Sync Parse Data-------", existPerson['person_id']);
       globalPersonId = existPerson['person_id'];
       globalSfdcId = existPerson['sfdc_id'];
      if (resumeData.personData && resumeData.personData.gender) {
        const personUpdate: any = { gender: resumeData.personData.gender };
        const personResdata = await this.personService.updatePerson(globalPersonId, personUpdate);
        console.log("----------AI Parser After Update Person Data------------")
      }
      if (resumeData.candidateProfile) {
        const oldAddress = existPerson.address ? existPerson.address : {};
        const { about_you, gender, profile_title, latest_resume, address } = resumeData.candidateProfile;        
        var schemaObj: any = {};
        const candidateUpdate: any = { };
        if(profile_title) {
          candidateUpdate['profile_title'] = profile_title;
        }
        if(about_you) {
          candidateUpdate['about_you'] = about_you;
        }
        if (address) {
          if (address.country && address.country.label) {
            oldAddress['country'] = address.country;
          }
          if (address['street_name']) {
            oldAddress['street_name'] = address['street_name'];
          }
          if (address['city']) {
            oldAddress['city'] = address['city'];
          }
          if (address['state'] && address.state.label) {
            oldAddress['state'] = address['state'];
          }
          if (address['zip']) {
            oldAddress['zip'] = address['zip'];
          }
          if (address['geocode']) {
            oldAddress['geocode'] = address['geocode'];
          }
          if (Object.keys(oldAddress).length) {
            candidateUpdate['address'] = oldAddress;
          }
        }
        
        if(latest_resume && latest_resume.length) {
          candidateUpdate['latest_resume'] = latest_resume;
        }
        if(gender) {
          candidateUpdate['gender'] = gender;
        }        
        if (resumeData.schemaProfile && resumeData.schemaProfile.skills && resumeData.schemaProfile.skills.length) {
          schemaObj['skills'] = resumeData.schemaProfile.skills;
        }
        if (resumeData.schemaProfile && resumeData.schemaProfile.employment_history && resumeData.schemaProfile.employment_history.length) {
          schemaObj['employment_history'] = resumeData.schemaProfile.employment_history;
        }
        if (resumeData.schemaProfile && resumeData.schemaProfile.languages && resumeData.schemaProfile.languages.length) {
          schemaObj['languages'] = resumeData.schemaProfile.languages;
        }
        if (resumeData.schemaProfile && resumeData.schemaProfile.educations && resumeData.schemaProfile.educations.length) {
          schemaObj['educations'] = resumeData.schemaProfile.educations;
        }
        if (resumeData.schemaProfile && resumeData.schemaProfile.certifications && resumeData.schemaProfile.certifications.length) {
          schemaObj['certifications'] = resumeData.schemaProfile.certifications;
        }    
        if (resumeData.schemaProfile && resumeData.schemaProfile.social_links && resumeData.schemaProfile.social_links.length) {         
          schemaObj['social_links'] = resumeData.schemaProfile.social_links;
        }   

        
      
        if (Object.keys(schemaObj).length) {
          candidateUpdate['$push'] = schemaObj
        };
        if(Object.keys(candidateUpdate).length) {
        const candidateResdata = await this.candidateProfileService.updateProfile(globalPersonId, candidateUpdate);
        console.log("-------AI Parser After Update Profile Data------------")
        }
      
      }
    } else {      
      const personData = { ...resumeData.personData };
      let names = personData.full_name ? personData.full_name.split(" ") : [];
      const eName = contactData["email"] ? contactData["email"].split("@") : [];
      names = names.length ? names : eName;
      const firstName = names[0];
      let lastName = names[names.length - 1];
      lastName = lastName ? lastName : firstName;

      const personSFData = { 
        LastName: firstName,
        FirstName: lastName,
        RecordTypeId: CANDIDATE_TYPE_ID,
        Email: personData.email,
        Email__c: personData.email,
        Phone: personData.phone ? personData.phone : "",
        Source__c: JOB_BOARD_ID,
       }
      console.log('-------------AI Parser Create Contact On SF----------', new Date())
      const sfResponse: any = await SalesforceApiService.fetchSFCompositeAPIService('Contact', personSFData);


      console.log('-------------AI Parser Create END Contact On SF----------', new Date())
      if (sfResponse && sfResponse.compositeResponse[0] && sfResponse.compositeResponse[0].body && sfResponse.compositeResponse[0].body.id) {
        console.log('sfResponse Contact::', sfResponse.compositeResponse[0].body);
        personData['sfdc_id'] = sfResponse.compositeResponse[0].body.id;
        const createPerson: any = await PersonModel.create({ ...personData });
        console.log("-------------After Create Person---------")
        globalPersonId = createPerson['_id'];
        globalSfdcId = createPerson['sfdc_id'] ? createPerson['sfdc_id'] : '';
        if (globalPersonId) {
          const candidateProfilePayload = {
            ...resumeData.candidateProfile,
            ...{
              person_id: globalPersonId,
              skills: resumeData.schemaProfile && resumeData.schemaProfile.skills ? resumeData.schemaProfile.skills : [],
              employment_history: resumeData.schemaProfile && resumeData.schemaProfile.employment_history ? resumeData.schemaProfile.employment_history : [],
              languages: resumeData.schemaProfile && resumeData.schemaProfile.languages ? resumeData.schemaProfile.languages : [],
              educations: resumeData.schemaProfile && resumeData.schemaProfile.educations ? resumeData.schemaProfile.educations : [],
              certifications: resumeData.schemaProfile && resumeData.schemaProfile.certifications ? resumeData.schemaProfile.certifications : [],
              social_links: resumeData.schemaProfile && resumeData.schemaProfile.social_links ? resumeData.schemaProfile.social_links : [],
              completeness_percentage: 25,
              profile_completeness: {
                category: "Personal Information",
                weightage: 25,
                is_complete: true,
                candidate_id: globalPersonId
              },
              jobboard_source: {
                jobboard_id: JOB_BOARD_ID,
                jobboard_name: JOB_BOARD_NAME,
                person_id: globalPersonId,
                sfdcId: JOB_BOARD_ID
              }
            }
          }
          if (resumeData.candidateProfile && resumeData.candidateProfile.latest_resume) {
            candidateProfilePayload['latest_resume'] = resumeData.candidateProfile.latest_resume;
          }
          const createData = await CandidateProfileModel.create(candidateProfilePayload);
          console.log("-------------After Create Candidate Profile---------")
          this.isgService.SyncTalentToIsg(createData, createData.person_id)
        }
      } else {
        console.error("---------Error fetch SF Composite API Service------------------", sfResponse.compositeResponse[0].body);
      }
    }
    console.log("-------------Befor Create Candidate Resume Profile---------")
    if(resumeData.candidateProfile && resumeData.candidateProfile.latest_resume && globalPersonId) {
      this.uploadDocumentFileIntoServiceo(globalPersonId, globalSfdcId, resumeData);  
    } 
  } catch(error) {
    console.error("AI Resume Parser to talent", error);
  }
  }

  async uploadDocumentFileIntoServiceo(globalPersonId: any, globalSfdcId: any, resumeData: any){
    const uploadCandidateResume: any = {
      person_id: globalPersonId,
      url: resumeData.candidateProfile.latest_resume,
      fileMeta: {
        originalname: resumeData.candidateProfile.latest_resume,
        filename: resumeData.candidateProfile.latest_resume,
        path: resumeData.candidateProfile.latest_resume
      }
    }
    const createResumeData = await this.candidateResumeService.createCandidateResume(uploadCandidateResume);
    console.log("-------------After Create Candidate Resume Profile---------")
    const sqsPayload = {
      "full_name": resumeData.candidateProfile.full_name,
      "email": resumeData.candidateProfile.email,
      "sfdcId": globalSfdcId ? globalSfdcId : '', // It can be blank also     
      "latest_resume": `${AWS_CANDIDATE_S3_BUCKET_BASE_URL}/${resumeData.candidateProfile.latest_resume}`,
      "jobboard_source": {
        jobboard_id: JOB_BOARD_ID,
        jobboard_name: JOB_BOARD_NAME,
        person_id: globalPersonId,
        sfdcId: JOB_BOARD_ID
      }
    }
    this.talentToServiceoResume(sqsPayload);
  }

  dateValidator(date: any) {
    let DateRes;
    if(date && !date.match('Current') && !date.match('Till') && !date.match('TillNow') && !date.match('Till Now')) {
      DateRes = new Date(date);
    }
    return DateRes
  }

  async prepairResumeParseData(parseData: any) {
    const { full_name, email, phone, gender } = parseData;
    const { about_you, profile_title, latest_resume, address } = parseData;
    const personData: any = { full_name, email, phone, gender };
    const candidateProfile: any = { ...personData, ...{ about_you, profile_title, latest_resume, address } };
    const schemaProfile: any = {};

    // Get Employment Id's and attachment with data
    if (parseData.employment_history && parseData.employment_history.length) {
      const employments = parseData.employment_history;
      const empArray = []
      for (let i = 0; i < employments.length; i++) {
        if (employments[i].title) {
          const newTitle = employments[i].title.replace(/[^a-zA-Z ]/g, "");
          const designation = employments[i].designation ? employments[i].designation : '';
          const organizationRes = await this.organizationService.getOrganizationIds(newTitle)
          const year_from = this.dateValidator(employments[i].year_from);
          const year_to   = this.dateValidator(employments[i].year_to);
          if (organizationRes) {
            const empObj: any = { id: organizationRes._id, title: organizationRes.title, designation: designation };
            if(year_from) {
              empObj['year_from'] = year_from;
            }
            if(year_to) {
              empObj['year_to'] = year_to;
            }
            empArray.push(empObj);
          }
        }
      }
      if (empArray && empArray.length) {
        schemaProfile['employment_history'] = empArray;
      }
    }
   // Get educations Id's and attachment with data
    if (parseData.educations && parseData.educations.length) {      
      const educations = parseData.educations;
      const eduArray = []
      for (let i = 0; i < educations.length; i++) {
        if (educations[i].title) {
          var institute = educations[i].institute && Object.keys(educations[i].institute).length ? educations[i].institute : {}
          const newTitle = educations[i].title.replace(/[^a-zA-Z ]/g, "");
          const organizationRes = await this.educationalDegreeService.getEducationIds(newTitle);
          if(institute && Object.keys(institute).length){
          institute['key'] = institute['value']
          }
          const year_from = this.dateValidator(educations[i].year_from);
          const year_to   = this.dateValidator(educations[i].year_to);
          const eduObj:any = { id: organizationRes._id, title: organizationRes.title, institute: institute }
          if(year_from) {
            eduObj['year_from'] = year_from;
          }
          if(year_to) {
            eduObj['year_to'] = year_to;
          }
          if (organizationRes) {
            eduArray.push(eduObj)
          }
        }
      }
      if (eduArray && eduArray.length) {
        schemaProfile['educations'] = eduArray;
      }     
    }

     // Get certifications Id's and attachment with data
    if (parseData.certifications && parseData.certifications.length) {      
      const certification = parseData.certifications;
      const certArray = []
      for (let i = 0; i < certification.length; i++) {
        if (certification[i].title && typeof certification[i].title === 'string') {
          const newTitle = certification[i].title.replace(/[^a-zA-Z ]/g, "");
          const description = certification[i].description ? certification[i].description : '';
          const valid_till = certification[i].valid_till ? certification[i].valid_till : '';        
          const certificationRes = await this.certificationService.getCertificationIds(newTitle)
          if (certificationRes) {
            certArray.push({ id: certificationRes._id, title: certificationRes.title, description: description, valid_till: valid_till})
          }
        }
      }
      if (certArray && certArray.length) {
        schemaProfile['certifications'] = certArray;
      }        
    }

    // Get languages Id's and attachment with data
    if (parseData.languages && parseData.languages.length) {
      const languageArr = [];
      for (let i = 0; i < parseData.languages.length; i++) {
        const newLanguages = parseData.languages[i] ? parseData.languages[i].replace(/[^a-zA-Z ]/g, "") : '';
        const lenguageRes = await this.langaugeService.getLangaugeIds(newLanguages)
        if (lenguageRes) {
          languageArr.push({ id: lenguageRes._id, title: lenguageRes.title, fluency_level: 'Native' });
        }
      }
      schemaProfile['languages'] = languageArr;
    }

    // Get skills Id's and attachment with data
    if (parseData.skills && parseData.skills.length) {
      const SkillsName = parseData.skills.map((e: any) => e.title);
      const skillsResult = await this.findAllSkillids(SkillsName);
      if (skillsResult && skillsResult.length) {
        schemaProfile['skills'] = skillsResult.length > 10 ? skillsResult.slice(0, 10) : skillsResult;
      }
    }

    if(parseData.social_links && parseData.social_links.length) {
      const sLinks = parseData.social_links.filter((s:any) => s.ProfileLink != '')
      schemaProfile['social_links'] = sLinks;
    }
    return { personData, candidateProfile, schemaProfile };
  }

  async findAllSkillids(skillsName: any[]): Promise<any[]> {
    const url = `${META_DATA_BASE_URL}/api/v1/skill/skillsbyname`;
    const payload = { name: skillsName };
    const skillResults: any = await axios.post(url, payload);
    if (skillResults && skillResults.data && skillResults.data.data) {
      const skillsData: any = [];
      skillResults.data.data.forEach((skill: any) => {
        skillsData.push({
          id: skill.id,
          title: skill.name,
          level: "3"

        })
      });
      return skillsData;
    } else {
      return [];
    }
  }

  talentToServiceoResume(payload :any) {
    const postParams = {    
        MessageBody: JSON.stringify(payload),
        MessageDeduplicationId: random(false, 100000000, 0).toString(),  // Required for FIFO queues
        MessageGroupId: "talent_resume_candid",  // Required for FIFO queues
        QueueUrl: AWS_TALENT_RESUME_TO_SERVICEO_SQS_URL
    }
   console.log('SQS::talentToServiceoResume:::Req', payload.email);
    sqs.sendMessage(postParams).promise().then((sqsMessage:any)=>{
        console.log('SQS::talentToServiceoResume:::Res', sqsMessage && sqsMessage.MessageId);
    }).catch((err:any)=>{
        console.log('SQS::talentToServiceoResume:::Err', err);
    });   
  }

}

export default AIParserSyncService;


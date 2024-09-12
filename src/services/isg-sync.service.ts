/**
 * Service Methods
 */

import { Service } from "typedi";
import { ObjectId } from 'mongodb'
const { random } = require('lodash');
const aws = require('aws-sdk');
import axios from "axios"

import PersonModel from '../models/person.model';
import CandidateProfileModel from "../models/candidate-profile.model";
import CandidateResumeModel from '../models/candidate-resume.model';
import JobApplicationModel from "../models/job-application.model";
import CandidateProfileService from "./candidate-profile.service";

var upload = require('../lib/upload');

import {AWS_SERVICEO_TO_SF_QUEUE_URL, SQS_REGION, SQS_ACCESSKEY, SQS_SECRETKEY, CANDIDATE_TYPE_ID, AWS_RESUME_RESPONSE_SQS, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} from "./../config"

const sqs = new aws.SQS({
    apiVersion: '2021-11-24',
    accessKeyId: SQS_ACCESSKEY,
    secretAccessKey: SQS_SECRETKEY,
    region: SQS_REGION
});
@Service()
class IsgSyncService {
    constructor(public candidateProfileService: CandidateProfileService) { }

  public async SyncIsg(message:any) {
    try {
        const body = this.parseMessage(message)
        console.log('--------ISG to Talent Model----------', body["Name"])
        switch (body["Name"]) {
            case "Contact":
                await this.createPerson(body)
                break;
            case "Skill__c":
                this.upsertSkill(body["Data"])
                break;
            case "Certification__c":
                console.log("Befor: ISG To Talent Certification__c Report Person..", body["Data"])
                this.upsertCertification(body["Data"])
                break;
            case "Education_History__c":
                console.log("Befor: ISG To Talent Education_History__c Report Person..", body["Data"])
                this.upsertEducationHistory(body["Data"])
                break;
            case "Employment_History__c":
                console.log("Befor: ISG To Talent tmployment_History__c Report Person..", body["Data"])
                this.upsertEmploymentHistory(body["Data"])
                break;
            case "Application__c":
                console.log("Befor: ISG To Talent Application__c record..", body["Data"])
                this.upsertApplicationRecord(body["Data"])
                break;
            case "Iron_Attachments__c": 
                console.log("CReateing Iron_Attachments__c record..", body["Data"])               
                this.createCandidateResume(body)
                break;
            default:
                console.log("Sync not enabled for ", body["Name"])
        }
    } catch(err) {
        console.error("ISG to talent Sync Error", err);
    }
    }

    public async SyncTalentToIsg(payload: any, personId: any) {
        // console.log('=====> Payload', payload, personId);
        try {
            console.log('Sync Talent to ISG=====> Payload', personId);
            let finalPayload: { eventType: string, data: any }[] = [];

            if (payload['$push'] && Object.keys(payload['$push']).length) {
                if(payload['$push'].skills && payload['$push'].skills.length)
                payload.skills = payload['$push'].skills ? payload['$push'].skills : [];

                if(payload['$push'].employment_history && payload['$push'].employment_history.length)
                payload.employment_history = payload['$push'].employment_history ? payload['$push'].employment_history : [];

                if(payload['$push'].languages && payload['$push'].languages.length)
                payload.languages = payload['$push'].languages ? payload['$push'].languages : [];

                if(payload['$push'].educations && payload['$push'].educations.length)
                payload.educations = payload['$push'].educations ? payload['$push'].educations : [];

                if(payload['$push'].certifications && payload['$push'].certifications.length)
                payload.certifications = payload['$push'].certifications ? payload['$push'].certifications : [];

                if(payload['$push'].social_links && payload['$push'].social_links.length)
                payload.social_links = payload['$push'].social_links ? payload['$push'].social_links : [];
            }

            if (payload.address || payload.languages || payload.full_name || payload.phone || payload.gender || payload.about_you) {
                console.log("Prepare COntact....")
                const contactPayload = await this.prepareContact(payload, personId);
                finalPayload = [...finalPayload, ...contactPayload]
            }

            if (payload.skills && payload.skills.length > 0) {
                const skillsPayload = await this.prepareSkill(personId);
                finalPayload = [...finalPayload, ...skillsPayload]
            }

            if (payload.certifications && payload.certifications.length > 0) {
                const certificationsPayload = await this.prepareCertification(personId);
                finalPayload = [...finalPayload, ...certificationsPayload]
            }

            if (payload.educations && payload.educations.length > 0) {
                const eductionPayload = await this.prepareEducation(personId);
                finalPayload = [...finalPayload, ...eductionPayload]
            }

            if (payload.employment_history && payload.employment_history.length > 0) {
                const empPayload = await this.prepareEmpHistory(personId);
                finalPayload = [...finalPayload, ...empPayload]
            }

            // console.log("FINAL PAYLOAD ====>",finalPayload)
            for (const sqsPayload of finalPayload) {
                this.servicetoIsg(sqsPayload)
            }
        } catch (err) {
            console.error("Talent to ISG Sync Error", err);
        }
    }

    async prepareContact(payload: any, personId: any) {   
        console.log("Person Id I got", personId)
        const person = await PersonModel.findById(personId);
        const getProfileData: any = await CandidateProfileModel.findOne({ person_id: personId });
        //console.log("GOT DATA.", person, getProfileData)
        const names = getProfileData.full_name.split(" ")
        //console.log("Names ==> ", names)
        const firstName = names[0];
        let lastName = names[names.length - 1];
        if (lastName == '') {
            lastName = firstName
        }
        let experienceYears = ""
        const experienceArray = getProfileData.total_experience.split("-");
        if (experienceArray.length > 0) {
            experienceYears = experienceArray[experienceArray.length - 1]
        }

        let profileData: any = {
            LastName: lastName,
            FirstName: firstName,
            RecordTypeId: CANDIDATE_TYPE_ID,
            Email: getProfileData.email,
            Email__c: getProfileData.email,
            Phone: getProfileData.phone ? getProfileData.phone : "",
            Gender__c: getProfileData.gender ? getProfileData.gender : "",
            Text_Resume__c: getProfileData.latest_resume ? getProfileData.latest_resume : "",
            Title: getProfileData.profile_title ? getProfileData.profile_title : "",
            ExperienceYrs__c: experienceYears, 
            Source__c: getProfileData.jobboard_source && getProfileData.jobboard_source.jobboard_name ? getProfileData.jobboard_source.jobboard_name : '',
        }

        if (getProfileData.address) {
            profileData['MailingCity'] = getProfileData.address.city ? getProfileData.address.city : "",
            profileData['MailingPostalCode'] = getProfileData.address.zip ? getProfileData.address.zip : "",
            profileData['MailingLatitude'] = Object.keys(getProfileData.address.geocode).length && getProfileData.address.geocode.latitude ? getProfileData.address.geocode.latitude : "",
            profileData['MailingLongitude'] = Object.keys(getProfileData.address.geocode).length && getProfileData.address.geocode.longitude ? getProfileData.address.geocode.longitude : "",
            profileData['MailingCountry'] = Object.keys(getProfileData.address.country).length && getProfileData.address.country.label ? getProfileData.address.country.label : "",
            profileData['MailingState'] = Object.keys(getProfileData.address.state).length && getProfileData.address.state.label ? getProfileData.address.state.label : ""
        }

        if (getProfileData.languages && getProfileData.languages.length) {
            let i = 1;
            getProfileData['languages'].forEach((element: any) => {
                if (i >= 3) {
                    return;
                }
                const lanKey = 'Language_Speak_' + i + '__c';
                Object.assign(profileData, { [lanKey]: element.title });
                i++;

            });
        }

        if (getProfileData.social_links && getProfileData.social_links.length) {
            getProfileData['social_links'].forEach((element: any) => {
                if (element.name == 'LinkedIn') {
                    Object.assign(profileData, { LinkedIn_Profile_Link__c: element.profile_link });
                }
                if (element.name == 'Facebook') {
                    Object.assign(profileData, { Facebook_Profile__c: element.profile_link });
                }
                if (element.name == 'Twitter') {
                    Object.assign(profileData, { Twitter_Profile__c: element.profile_link });
                }


            });
        }
        if (person?.sfdc_id && person.sfdc_id != '') {
            console.log(person)
            profileData.Id = person.sfdc_id;
        } else {
            console.log(
                "INELSE", person
            )
        }

        //console.log("profileData===>>>:: ", profileData)
        return [{ eventType: 'Contact', data: profileData }]
    }


    async prepareEducation(personId: any) {
        const person = await PersonModel.findById(personId) //this.findPersonFromSfdcId(personId);
        const getProfileData: any = await CandidateProfileModel.findOne({ person_id: personId });
        let dataObj: any[] = []
        if (person?.sfdc_id && getProfileData.educations && getProfileData.educations.length) {
            getProfileData['educations'].forEach((element: any) => {
                let instituteName = element.institute && element.institute.label ? element.institute && element.institute.label : '';
                let gDate: any =  element.year_to ? new Date(element.year_to) : '';
                gDate = gDate ? gDate.getFullYear() : ''
                const eduObj: any = { 
                     Contact__c: person?.sfdc_id,
                     Degree__c: element.title, 
                     Major__c:  element.title,
                     Name__c: instituteName }
                     if(gDate && element.year_to) {
                        eduObj['GraduationDate__c'] = element.year_to;
                        eduObj['Graduation_Year__c'] = gDate;
                     }
                dataObj.push({ eventType: 'EducationHistory', data:  eduObj});
            });
        }
        return dataObj;
    }

    async prepareCertification(personId: any) {
        const person = await PersonModel.findById(personId)
        const getProfileData: any = await CandidateProfileModel.findOne({ person_id: personId });
        let dataObj: any[] = []

        if (person?.sfdc_id && getProfileData.certifications && getProfileData.certifications.length) {
            getProfileData['certifications'].forEach((element: any) => {
                const cerObj: any = { Contact__c: person?.sfdc_id, Certification_License_Name__c: element.title } 
                if(element.valid_till) {
                    cerObj['Expiration_Date__c'] = element.valid_till
                }
                dataObj.push({ eventType: 'Certification', data: cerObj});
            });
        }
        return dataObj
    }
 
    async prepareEmpHistory(personId: any) {
        const person = await PersonModel.findById(personId)
        const getProfileData: any = await CandidateProfileModel.findOne({ person_id: personId });

        let dataObj: any[] = []

        if (person?.sfdc_id && getProfileData.employment_history && getProfileData.employment_history.length) {
            getProfileData['employment_history'].forEach((element: any) => {
                const empObj: any = {
                    Name__c: element.title,
                    Job_Title__c: element.designation,
                    Responsibilities__c: element.responsibility,
                    Location__c: element.location,
                    Contact__c: person?.sfdc_id
                }
                if(element.year_to) {
                    empObj['Employment_End_Date__c'] =  element.year_to; 
                }
                if(element.year_from) {
                    empObj['Employment_Start_Date__c'] =  element.year_from; 
                }
                dataObj.push(
                    {
                        eventType: 'EmploymentHistory', data:empObj
                        
                    });
            });
        }

        return dataObj;

    }

    async prepareSkill(personId: any) {
        const person = await PersonModel.findById(personId)
        const getProfileData: any = await CandidateProfileModel.findOne({ person_id: personId });

        let dataObj: any[] = []

        console.log("====>>", person?.sfdc_id)

        if (person?.sfdc_id && getProfileData.skills && getProfileData.skills.length) {
            getProfileData['skills'].forEach((element: any) => {
                dataObj.push({
                    eventType: 'JobSkills', data:
                    {
                        Skill_Name__c: element.title,
                        Level__c: element.level,
                        Contact__c: person?.sfdc_id
                    }
                })
            });
        }
        return dataObj;
    }

    parseMessage(message: any): { Name: string, Id: string, Data: any } {
        let body = JSON.parse(message['Body']).Message;
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        return body
    }

    async createPerson(contactData: { Name: string, Id: string, Data: any }) {
        if (contactData["Data"].Email && contactData["Data"].Email != "") {
            const personFind: any = await PersonModel.findOne({
                $or: [
                    { "email": contactData["Data"].Email },
                    { "sfdc_id": contactData["Data"].Id },
                ]
            });
            console.log("---------Person Exist:: ISG to Talent", personFind ?  personFind.email :  "empty email")
            const person: any =  this.prepairPerson(contactData);
            const profileData: any = this.prepairCandidateProfile(personFind, contactData);

            if (personFind && Object.keys(personFind).length) {
                const existCandidate: any = await CandidateProfileModel.findOne({ email: personFind.email})              
                delete person.email
                delete profileData.languages;
                delete profileData.jobboard_source
                //Person Update
                const queryPerson = { "_id": personFind._id };
                const updatePersonObj = {$set: person};
                console.log("---Befor: ISG to Talent Person Update---")
                const upPerson = await PersonModel.updateOne(queryPerson, updatePersonObj);
                console.log("---After: ISG to Talent Person Update---")
                console.log("--Before :: ISG to Talent Profile", existCandidate)
                //Candidate Update
                profileData.person_id = personFind._id.toString()               
                profileData['address'] = this.prepairAddress(existCandidate, profileData);    
                profileData['languages'] = this.prepairLanguages(existCandidate, profileData);  
                profileData['jobboard_source'] = this.prepairJobboardSource(existCandidate, profileData) ;   
                const queryProfile = { "person_id": personFind._id };           
                const updateDocumentprofile = { $set: profileData };
                console.log("---Befor: ISG to Talent Profile Update---")
                const up = await CandidateProfileModel.updateOne(queryProfile, updateDocumentprofile);
                console.log("---After: ISG to Talent Profile Update---", up);

            } else {
                console.log("---Befor: ISG to Talent Person Create---")
                const personData: any = await PersonModel.create({ ...person });
                console.log("---After: ISG to Talent Person Create---")
                profileData.person_id = personData._id.toString()
                profileData.jobboard_source.person_id = profileData.person_id
                console.log("---Befor: ISG to Talent Before Profile Create---")
                const profileDataCreated: any = await CandidateProfileModel.create({ ...profileData });
                console.log("---After: ISG to Talent Profile Create---");
            }
        } else {
            console.log("ISG to Talent Emaill Not Present on record")
        }
    }
    prepairPerson(contactData: any){
        return {
            full_name: contactData["Data"].Contact_Name__c,
            email: contactData["Data"].Email,
            phone: contactData["Data"].Phone ? contactData["Data"].Phone : "",
            sfdc_id: contactData["Data"].Id,
            gender: contactData["Data"].Gender__c ? contactData["Data"].Gender__c : ""
        }
    }
    prepairCandidateProfile(personFind: any, contactData: any){
        const data: any = {
            person_id: personFind ? personFind._id : '',
            full_name: contactData["Data"].Contact_Name__c ? contactData["Data"].Contact_Name__c : '',
            email: contactData["Data"].Email,
            phone: contactData["Data"].Phone ? contactData["Data"].Phone : "",
            gender: contactData["Data"].Gender__c ? contactData["Data"].Gender__c : "",
            //latest_resume: contactData["Data"].Text_Resume__c ? contactData["Data"].Text_Resume__c : "",
            profile_title: contactData["Data"].Title ? contactData["Data"].Title : "",
            total_experience: contactData["Data"].ExperienceYrs__c ? contactData["Data"].ExperienceYrs__c : "",
            address: {
                city: contactData["Data"].MailingCity ? contactData["Data"].MailingCity : "",
                zip: contactData["Data"].MailingPostalCode ? contactData["Data"].MailingPostalCode : "",
                geocode: {
                    latitude: contactData["Data"].MailingLatitude ? contactData["Data"].MailingLatitude : "",
                    longitude: contactData["Data"].MailingLongitude ? contactData["Data"].MailingLongitude : ""
                },
                country: {
                    label: contactData["Data"].MailingCountry ? contactData["Data"].MailingCountry : "",
                    value: contactData["Data"].MailingCountry ? contactData["Data"].MailingCountry : "",
                    key: contactData["Data"].MailingCountry ? contactData["Data"].MailingCountry : ""
                },
                state: {
                    label: contactData["Data"].MailingState ? contactData["Data"].MailingState : "",
                    value: contactData["Data"].MailingState ? contactData["Data"].MailingState : "",
                    key: contactData["Data"].MailingState ? contactData["Data"].MailingState : ""
                }
            },
            jobboard_source: {
                id: contactData["Data"].Source__c ? contactData["Data"].Source__c : "",
                jobboard_name: contactData["Data"].Source__c ? contactData["Data"].Source__c : "",
                person_id: "",
                sfdcId: contactData["Data"].Id
            },
            languages: [],
            social_links: []
        }
         // Set Languages Links
        if (contactData["Data"].Language_Speak_1__c && contactData["Data"].Language_Speak_1__c) {
            data.languages.push({ id: new ObjectId(), title: contactData["Data"].Language_Speak_1__c })
        }
        if (contactData["Data"].Language_Speak_2__c && contactData["Data"].Language_Speak_2__c) {
            data.languages.push({ id: new ObjectId(), title: contactData["Data"].Language_Speak_2__c })
        }
        // Set Social Links
        if (contactData["Data"].LinkedIn_Profile_Link__c && contactData["Data"].LinkedIn_Profile_Link__c) {
            data.social_links.push({ id: new ObjectId(), name: "LinkedIn", profile_link: contactData["Data"].LinkedIn_Profile_Link__c })
        }
        if (contactData["Data"].Facebook_Profile__c && contactData["Data"].Facebook_Profile__c) {
            data.social_links.push({ id: new ObjectId(), name: "Facebook", profile_link: contactData["Data"].Facebook_Profile__c })
        }
        if (contactData["Data"].Twitter_Profile__c && contactData["Data"].Twitter_Profile__c) {
            data.social_links.push({ id: new ObjectId(), name: "Twitter", profile_link: contactData["Data"].Twitter_Profile__c })
        }

        return data;
    }
    prepairAddress(existCandidate: any, profileData: any) {
        const oldAddress = existCandidate.address ? existCandidate.address : {};
        
        if (profileData && profileData.address) {
            const address = profileData.address;
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
        }
        return oldAddress;
    }
    prepairLanguages(existCandidate: any, profileData: any){
        let language = [];
        if(existCandidate.language && existCandidate.language.length) {
            language = existCandidate.language;
        } 
        if(profileData.language && profileData.language.length) {
            language= [...language, profileData.language];
        }     
        return language;
    }
    prepairJobboardSource(existCandidate: any, profileData: any){
        let jobBoard = {};
        if(existCandidate.jobboard_source && existCandidate.jobboard_source.id) {
            jobBoard = existCandidate.jobboard_source;
        } else if(profileData.jobboard_source && profileData.jobboard_source.id) {
            jobBoard= profileData.jobboard_source;
        }     
        return jobBoard;
    }

    async upsertSkill(Data: any) {

        const personFind = await this.findPersonFromSfdcId(Data.Contact__c)

        if (personFind) {
            const query = { "person_id": personFind._id, "skills.title": Data.Skill_Name__c };
            const updateDocument = {
                $set: { "skills.$.level": Data.Level__c }
            };


            const up = await CandidateProfileModel.updateOne(query, updateDocument);
            if (up.modifiedCount == 0) {
                const insertNew = { "$push": { "skills": { title: Data.Skill_Name__c, level: Data.Level__c } } };
                const skills = await CandidateProfileModel.updateOne(
                    { "person_id": personFind._id },
                    insertNew
                )
                console.log("New Record Added In Skills...", skills)
            }


        } else {
            console.log("No Person Found..")
        }

    }


    async upsertCertification(Data: any) {
        const personFind = await this.findPersonFromSfdcId(Data.Contact__c)

        if (personFind) {
            const query = { "person_id": personFind._id, "certifications.title": Data.Certification_License_Name__c };
            const updateDocument = {
                $set: { "certifications.$.valid_till": Data.Expiration_Date__c }
            };

            console.log(query)
            console.log(updateDocument)
            const up = await CandidateProfileModel.updateOne(query, updateDocument);
            if (up.modifiedCount == 0) {
                const insertNew = { "$push": { "certifications": { title: Data.Certification_License_Name__c, valid_till: Data.Expiration_Date__c } } };
                const certifications = await CandidateProfileModel.updateOne(
                    { "person_id": personFind._id },
                    insertNew
                )
                console.log("New Record Added In Certifications...", certifications)
            }


        } else {
            console.log("No Person Found..")
        }
    }
    async upsertEducationHistory(Data: any) {
        const personFind = await this.findPersonFromSfdcId(Data.Contact__c)

        if (personFind) {
            const schoolDetials = {
                label: Data.Name__c,
                value: Data.Name__c,
                key: Data.Name__c
            }

            const query = { "person_id": personFind._id, "educations.title": Data.Degree__c };
            const updateDocument = {
                $set: {
                    "educations.$.year_to": Data.GraduationDate__c ? new Date(Data.GraduationDate__c) : null,
                    "educations.$.institute": schoolDetials
                }
            };

            console.log(query)
            console.log(updateDocument)
            const up = await CandidateProfileModel.updateOne(query, updateDocument);
            if (up.modifiedCount == 0) {
                const insertNew = { "$push": { "educations": { title: Data.Degree__c, year_to: Data.GraduationDate__c ? new Date(Data.GraduationDate__c) : null, institute: schoolDetials } } };
                const educations = await CandidateProfileModel.updateOne(
                    { "person_id": personFind._id },
                    insertNew
                )
                console.log("New Record Added In educations...", educations)
            }


        } else {
            console.log("No Person Found..")
        }
    }

    async upsertEmploymentHistory(Data: any) {
        // console.log(Data)
        const personFind = await this.findPersonFromSfdcId(Data.Contact__c)

        if (personFind) {
            const employment_type = {
                label: Data.Name__c,
                value: Data.Name__c,
                key: Data.Name__c
            }

            const query = { "person_id": personFind._id, "employment_history.title": Data.Job_Title__c };
            const updateDocument = {
                $set: {
                    "employment_history.$.year_to": Data.Employment_End_Date__c ? new Date(Data.Employment_End_Date__c) : null,
                    "employment_history.$.year_from": Data.Employment_Start_Date__c ? new Date(Data.Employment_Start_Date__c) : null,
                    "employment_history.$.responsibility": Data.Responsibilities__c,
                    "employment_history.$.location": Data.Location__c
                }
            };

            console.log(query)
            console.log(updateDocument)
            const up = await CandidateProfileModel.updateOne(query, updateDocument);
            if (up.modifiedCount == 0) {
                const insertNew = {
                    "$push": {
                        "employment_history":
                        {
                            title: Data.Name__c,
                            year_to: Data.Employment_End_Date__c ? new Date(Data.Employment_End_Date__c) : null,
                            year_from: Data.Employment_Start_Date__c ? new Date(Data.Employment_Start_Date__c) : null,
                            responsibility: Data.Responsibilities__c,
                            designation: Data.Job_Title__c,
                            location: Data.Location__c
                        }
                    }
                };

                const employment_history = await CandidateProfileModel.updateOne(
                    { "person_id": personFind._id },
                    insertNew
                )
                console.log("New Record Added In employment_history...", employment_history)
            }


        } else {
            console.log("No Person Found..")
        }
    }

    async upsertApplicationRecord(Data: any) {
        const personFind = await this.findPersonFromSfdcId(Data.Candidate_Contact__c)
        console.log('application PersonFind', personFind && personFind._id)
        if (personFind && personFind._id) {
            const query = { "applied_by_candidate": personFind._id, sfdc_id: Data.Id };
            console.log('ISG to Talent Application Query----', query);
            const isApplicationExist = await JobApplicationModel.findOne(query);
            if (isApplicationExist) {              
                console.log("BEFORE: ISG to Talent Update In Application...");
                const up = await JobApplicationModel.updateOne(query, { application_stage: Data.Stage__c });
                console.log("AFTER: ISG to Talent Update In Application...");
            } else {
                const applicationObj = {
                    applied_by_candidate: personFind._id,
                    candidate_sfdcId: Data.Candidate_Contact__c,
                    job_order_id: Data.Job__c,
                    applied_on: Data.Application_submittal_Datetime__c ? new Date(Data.Application_submittal_Datetime__c) : new Date(),
                    is_cancelled: Data.Application_Status__c && Data.Application_Status__c === 'Cancelled' ? true : false,
                    application_stage: Data.Stage__c,
                    sfdc_id: Data.Id,
                    hiring_manager: Data.Hiring_Manager__c,
                    secondary_recruiter: Data.Secondary_Recruiter__c,
                    guest_full_name: personFind.full_name,
                    guest_email: personFind.email,
                    guest_phone: personFind.phone
                }
                console.log("BEFOR: ISG to Talent New Record Added In Application...", applicationObj);
                const applicationRes = await JobApplicationModel.create(applicationObj)
                console.log("AFTER: ISG to Talent New Record Added In Application...");
            }
        } else {
            console.log("No Person Found..")
        }
    }

    async createCandidateResume(body: any) {
        if(body["Data"]?.Contact__c) {
            console.log("IST to Talent Iron Attachment Contact__c", body["Data"].Contact__c)
            let person = await this.findPersonFromSfdcId(body["Data"].Contact__c)
            console.log("IST to Talent Iron Attachment Find Person ", person?.id)
            if (person?.id) {
                const isFileExist = await CandidateResumeModel.findOne({person_id : person?.id, url : body["Data"].File_Name__c});
                console.log("IST to Talent Person isFileExist ", isFileExist) 
                if(!isFileExist) {                            
                    const fileUpdate =  await this.uploadFileToCandidateS3(body["Data"], person)
                    if(fileUpdate.status) {
                        const uploadCandidateResume: any = {
                            person_id: person?.id,
                            url: fileUpdate.fileName 
                        }
                        console.log('IST to Talent Create Candidate Resume::', new Date());
                        await CandidateResumeModel.create({ ...uploadCandidateResume });
                    }
                }
            }    
        }
    }

    async findPersonFromSfdcId(Id: string) {
        return PersonModel.findOne({ sfdc_id: Id })
    }


    clean(obj: any) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    }



    servicetoIsg(payload: any) {
        const postParams = {
            MessageBody: JSON.stringify(payload),
            MessageDeduplicationId: random(false, 100000000, 0).toString(),  // Required for FIFO queues
            MessageGroupId: "talent_candid",  // Required for FIFO queues
            QueueUrl: AWS_SERVICEO_TO_SF_QUEUE_URL
        }
        // console.log('sqsMessage:::Req', postParams);
        console.log('SQS::TalentToIS::EventName', payload.eventType);
        if (payload.eventType !== 'JobSkills') {
            console.log('SQS::TalentToIS::Payload', payload);
        }    
        sqs.sendMessage(postParams).promise().then((sqsMessage: any) => {
            if (payload.eventType == 'Contact') {
                console.log('SQS::TalentToISG:::Res', sqsMessage && sqsMessage.MessageId);
            }
        }).catch((err: any) => {
            console.log('sqsMessage:::Err', err);
        });

    }

    async uploadFileToCandidateS3(req: any, person: any) {
        console.log("In File Buffer", req)   
        const response = await axios.get(req.ServiceO_Document_Link__c, { responseType: 'arraybuffer' })
        console.log("After Response")
        const buffer = Buffer.from(response.data, "utf-8");
        const fileData = {
            buffer: buffer,
            originalname : req.File_Name__c,
            filename: req.File_Name__c   
        };
        console.log("FILE DATA===================================================")
        console.log(fileData)   
        return await upload.uploadFile(fileData, person);
        // this.ps
        // uploadDocumentAwsBucket(fileData, {id: req.userId}, true);
    }


}

export default IsgSyncService;


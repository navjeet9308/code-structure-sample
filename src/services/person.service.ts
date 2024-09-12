/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Person } from '@my-app/common/src/candidate/person.interface';
 import PersonModel from '../models/person.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 var mailer = require('../lib/mailer');
 var upload = require('../lib/upload');
 var auth0Management = require('../lib/auth0');
 @Service()
 class PersonService {
 
   public async findAllPerson(): Promise<Person[]> {
     const persones: Person[] = await PersonModel.find();
     return persones;
   }
 
   public async findPersonById(personId: string): Promise<Person> {
     if (isEmpty(personId)) throw new HttpException(400, "Please provide person Id");
 
     const findPerson: any = await PersonModel.findOne({ _id: personId }!).select({
        email: 1,
       full_name: 1,
       phone: 1,
       picture:1,
       gender:1,
       sfdc_id: 1,
       verify_otp:1,
       verify_email:1,
       socialAuthSub: 1,
       linkedLoginIn: 1,
       googleLoginIn: 1
     });
     if (!findPerson) throw new HttpException(409, "No person found.");
 
     return findPerson;
   }
 
   public async createPerson(PersonData: Person): Promise<Person> {
     if (isEmpty(PersonData)) throw new HttpException(400, "Person data is required.");
     const personData:any = await PersonModel.create({ ...PersonData });
     delete personData['otp'];
     return personData;
   }

   public async createSocialPerson(PersonData: any): Promise<any> {
    if (isEmpty(PersonData)) return "Person data is required.";
    const personData:any = await PersonModel.create({ ...PersonData });
    return personData;
  }
 
   public async updatePerson(personId: string, personData: Person): Promise<Person> {
     if (isEmpty(personData)) throw new HttpException(400, "Person data is required.");
 
     const updatePersonById: Person | null = await PersonModel.findByIdAndUpdate(personId, personData);
     if (!updatePersonById) throw new HttpException(409, "Failed to update person.");
 
     return updatePersonById;
   }
 
   public async deletePerson(personId: string): Promise<Person> {
     const deletePersonById: Person | null = await PersonModel.findByIdAndDelete(personId);
     if (!deletePersonById) throw new HttpException(409, "Failed to delete person.");
 
     return deletePersonById;
   }

   public async checkPerson(email: string): Promise<any> {
     if (isEmpty(email)) throw new HttpException(400, "Please provide email.");
     const findPersonEmail: any = await PersonModel.findOne({ email: email }); 
     if (!findPersonEmail) throw new HttpException(409, "No email found.");
     console.log('checkPerson2::',findPersonEmail)
     return findPersonEmail;
   }

   public async checkPersonByEmailForResumeParser(email: string): Promise<any> {
    const findPersonEmail: any = await PersonModel.findOne({ email: email });   
    return findPersonEmail;
  }
  
   public async sentEmailOtp(email: string): Promise<Person> {
     if (isEmpty(email)) throw new HttpException(400, "Please provide email.");
     let otp = Math.floor(100000 + Math.random() * 900000);
     const personData: any | null = await PersonModel.findOne({ email: email }!);
     const updatePersonById: any | null = await PersonModel.findByIdAndUpdate(personData._id, {otp:otp});
     if (!updatePersonById) throw new HttpException(409, "Failed to update person.");
     if (updatePersonById) {
       const name = personData['full_name'];
       const nameCaps = name.toLowerCase().replace(/\b[a-z]/g, function (letter: any) {
         return letter.toUpperCase();
       });
       const emailReq = {
         email: personData['email'],
         template: 'user-otp',
         subject: 'Login OTP',
         otp: otp,
         full_name: nameCaps
       }
      return this.sendEmail(emailReq);
     } else {
       return updatePersonById;
     }
     
   }

   public async matchOtp(personId: string, otp: string): Promise<Person> {
    if (isEmpty(otp)) throw new HttpException(400, "Please provide email.");
    const findPersonOTP: any = await PersonModel.findOne({ otp: otp,_id:personId }!);
    if (!findPersonOTP) throw new HttpException(409, "No otp match.");
    const updatePersonById: Person | null = await PersonModel.findByIdAndUpdate(personId, {verify_otp: true});
    return findPersonOTP;
  }
  public async uploadFile(fileName: string, person: any): Promise<Person> {
    if (isEmpty(fileName)) throw new HttpException(400, "Please provide file to upload.");
    return upload.uploadFile(fileName, person);
  }

  public async parserResumeApi(fileName: string, person: any): Promise<Person> {
    if (isEmpty(fileName)) throw new HttpException(400, "Please provide file to upload.");
    return upload.uploadFileAIParser(fileName, person);
  }

  public async changePassword(personId: string, personData: Person): Promise<Person> {
    if (isEmpty(personData)) throw new HttpException(400, "Person data is required.");
    this.updateAuth0Password(personId,personData);
    const updatePersonById: Person | null = await PersonModel.findByIdAndUpdate(personId, personData);
    if (!updatePersonById) throw new HttpException(409, "Failed to update person.");

    return updatePersonById;
  }

  public async countPerson(filterObj : any): Promise<number> {
    const personCount = await PersonModel.countDocuments(filterObj);   
    return personCount;
  }
  public async sendEmail(req:any){
    let messageData = {
      from: 'nitish090788@gmail.com',
      to: req['email'],
      template: req['template'],
      params: {
        ctx: req
      }
    }
    const email = await mailer.send(messageData);
    return email;
  }
  public async createAuth0User(data: any): Promise<Person> {
    if (isEmpty(data)) throw new HttpException(400, "Please provide data to create.");
    return auth0Management.createAuth0User(data);
  }
  public async updateAuth0Password(personId: any,data:any): Promise<Person>{
    const personData: any | null = await PersonModel.findOne({_id:personId }!);
    data['email']= personData['email'];
    return auth0Management.updateAuthOUser(data);
  }

  public async login(email: string, password: string): Promise<Person> {
    if (isEmpty(email)) throw new HttpException(400, "Please provide email.");
    if (isEmpty(password)) throw new HttpException(400, "Please provide password.");
    const findPersonData: Person | null = await PersonModel.findOne({ email: email, password: password }!);
    if (!findPersonData) throw new HttpException(409, "No user found.");

    return findPersonData;
  }
 }
 
 export default PersonService;
 

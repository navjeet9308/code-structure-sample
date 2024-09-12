/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { EducationInstitute } from '@my-app/common/src/candidate/education-institute.interface';
 import EducationInstituteModel from '../models/education-institute.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class EducationInstituteService {
 
   public async findAllEducationInstitute(): Promise<EducationInstitute[]> {
     const educationInstitutes: EducationInstitute[] = await EducationInstituteModel.find();
     return educationInstitutes;
   }
   public async findAllEducationInstituteByName(name: string): Promise<any[]> {
    const educationInstitutes = await EducationInstituteModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return educationInstitutes;
  }
 
   public async findEducationInstituteById(educationInstituteId: string): Promise<EducationInstitute> {
     if (isEmpty(educationInstituteId)) throw new HttpException(400, "Please provide Id");
 
     const findEducationInstitute: EducationInstitute | null = await EducationInstituteModel.findOne({ _id: educationInstituteId }!);
     if (!findEducationInstitute) throw new HttpException(409, "Education Institute not found");
 
     return findEducationInstitute;
   }
 
   public async createEducationInstitute(educationInstituteData: EducationInstitute): Promise<EducationInstitute> {
     if (isEmpty(educationInstituteData)) throw new HttpException(400, "EducationInstitute data is required");
 
     const createEducationInstituteData:any = await EducationInstituteModel.create({ ...educationInstituteData });
 
     return createEducationInstituteData;
   }
 
   public async updateEducationInstitute(educationInstituteId: string, educationInstituteData: EducationInstitute): Promise<EducationInstitute> {
     if (isEmpty(educationInstituteData)) throw new HttpException(400, "EducationInstitute data is required");
 
     const updateEducationInstituteById: EducationInstitute | null = await EducationInstituteModel.findByIdAndUpdate(educationInstituteId, educationInstituteData);
     if (!updateEducationInstituteById) throw new HttpException(409, "Failed to update EducationInstitute");
 
     return updateEducationInstituteById;
   }
 
   public async deleteEducationInstitute(educationInstituteId: string): Promise<EducationInstitute> {
     const deleteEducationInstituteIdById: EducationInstitute | null = await EducationInstituteModel.findByIdAndDelete(educationInstituteId);
     if (!deleteEducationInstituteIdById) throw new HttpException(409, "Failed to delete EducationInstitute");
 
     return deleteEducationInstituteIdById;
   }
 }
 
 export default EducationInstituteService;
 

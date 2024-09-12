/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { EducationalDegree } from '@my-app/common/src/candidate/educational-degree.interface';
 import EducationalDegreeModel from '../models/educational-degree.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class EducationalDegreeService {
 
   public async findAllEducationalDegree(): Promise<EducationalDegree[]> {
     const educationalDegrees: EducationalDegree[] = await EducationalDegreeModel.find();
     return educationalDegrees;
   }

   public async findAllEducationalDegreeByName(name: string): Promise<any[]> {
    const educationalDegrees = await EducationalDegreeModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return educationalDegrees;
  }

  public async getEducationIds(educationName: any): Promise<any> {
    let education: any = await EducationalDegreeModel.findOne({ title: { $regex: educationName, $options: 'i' } });
    if (!(education && education.title)) {
      education = await EducationalDegreeModel.create({ title: educationName } );
    }
    return education;
  }
   
 
   public async findEducationalDegreeById(educationalDegreeId: string): Promise<EducationalDegree> {
     if (isEmpty(educationalDegreeId)) throw new HttpException(400, "Please provide Id");
 
     const findEducationalDegree: EducationalDegree | null = await EducationalDegreeModel.findOne({ _id: educationalDegreeId }!);
     if (!findEducationalDegree) throw new HttpException(409, "Education Degree not found");
 
     return findEducationalDegree;
   }
 
   public async createEducationalDegree(educationalDegreeData: EducationalDegree): Promise<EducationalDegree> {
     if (isEmpty(educationalDegreeData)) throw new HttpException(400, "EducationalDegree data is required");
 
     const createEducationalDegreeData:any = await EducationalDegreeModel.create({ ...educationalDegreeData });
 
     return createEducationalDegreeData;
   }
 
   public async updateEducationalDegree(educationalDegreeId: string, educationalDegreeData: EducationalDegree): Promise<EducationalDegree> {
     if (isEmpty(educationalDegreeData)) throw new HttpException(400, "EducationalDegree data is required");
 
     const updateEducationalDegreeById: EducationalDegree | null = await EducationalDegreeModel.findByIdAndUpdate(educationalDegreeId, educationalDegreeData);
     if (!updateEducationalDegreeById) throw new HttpException(409, "Failed to update EducationalDegree");
 
     return updateEducationalDegreeById;
   }
 
   public async deleteEducationalDegree(educationalDegreeId: string): Promise<EducationalDegree> {
     const deleteEducationalDegreeById: EducationalDegree | null = await EducationalDegreeModel.findByIdAndDelete(educationalDegreeId);
     if (!deleteEducationalDegreeById) throw new HttpException(409, "Failed to delete EducationalDegree");
 
     return deleteEducationalDegreeById;
   }
 }
 
 export default EducationalDegreeService;
 

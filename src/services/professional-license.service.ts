/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { ProfessionalLicense } from '@my-app/common/src/candidate/professional-license.interface';
 import ProfessionalLicenseModel from '../models/professional-license.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class ProfessionalLicenseService {
 
   public async findAllProfessionalLicense(): Promise<ProfessionalLicense[]> {
     const professionalLicenses: ProfessionalLicense[] = await ProfessionalLicenseModel.find();
     return professionalLicenses;
   }
 
   public async findProfessionalLicenseById(professionalLicenseId: string): Promise<ProfessionalLicense> {
     if (isEmpty(professionalLicenseId)) throw new HttpException(400, "ProfessionalLicense Id is required.");
 
     const findProfessionalLicense: ProfessionalLicense | null = await ProfessionalLicenseModel.findOne({ _id: professionalLicenseId }!);
     if (!findProfessionalLicense) throw new HttpException(409, "ProfessionalLicense not found.");
 
     return findProfessionalLicense;
   }
 
   public async createProfessionalLicense(professionalLicenseData: ProfessionalLicense): Promise<ProfessionalLicense> {
     if (isEmpty(professionalLicenseData)) throw new HttpException(400, "ProfessionalLicense data is required.");
 
     const createProfessionalLicense:any = await ProfessionalLicenseModel.create({ ...professionalLicenseData });
 
     return createProfessionalLicense;
   }
 
   public async updateProfessionalLicense(professionalLicenseId: string, professionalLicenseData: ProfessionalLicense): Promise<ProfessionalLicense> {
     if (isEmpty(professionalLicenseData)) throw new HttpException(400, "ProfessionalLicense data is required.");
 
     const updateProfessionalLicenseById: ProfessionalLicense | null = await ProfessionalLicenseModel.findByIdAndUpdate(professionalLicenseId, professionalLicenseData);
     if (!updateProfessionalLicenseById) throw new HttpException(409, "Failed to update ProfessionalLicense.");
 
     return updateProfessionalLicenseById;
   }
 
   public async deleteProfessionalLicense(professionalLicenseId: string): Promise<ProfessionalLicense> {
     const deleteProfessionalLicenseById: ProfessionalLicense | null = await ProfessionalLicenseModel.findByIdAndDelete(professionalLicenseId);
     if (!deleteProfessionalLicenseById) throw new HttpException(409, "Failed to delete ProfessionalLicense.");
 
     return deleteProfessionalLicenseById;
   }
 }
 
 export default ProfessionalLicenseService;
 

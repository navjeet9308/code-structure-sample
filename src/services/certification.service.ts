/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Certification } from '@my-app/common/src/candidate/certification.interface';
 import CertificationModel from '../models/certification.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class CertificationService {
 
   public async findAllCertification(): Promise<Certification[]> {
     const certifications: Certification[] = await CertificationModel.find();
     return certifications;
   }
   public async findAllCertificationByName(name: string): Promise<any[]> {
     const educationInstitutes = await CertificationModel.find({ title: { $regex: name, $options: 'i' } }).sort({ title: 1 }).limit(10);
     return educationInstitutes;
   }

   public async getCertificationIds(certificationName: any): Promise<any> {
    let certification: any = await CertificationModel.findOne({ title: { $regex: certificationName, $options: 'i' } });
    if (!(certification && certification.title)) {
      certification = await CertificationModel.create({ title: certificationName } );
    }
    return certification;
  } 
   public async findCertificationById(certificationId: string): Promise<Certification> {
     if (isEmpty(certificationId)) throw new HttpException(400, "Certificate Id is required");
 
     const findCertification: Certification | null = await CertificationModel.findOne({ _id: certificationId }!);
     if (!findCertification) throw new HttpException(409, "Certificate not found ");
 
     return findCertification;
   }
 
   public async createCertification(certificationData: Certification): Promise<Certification> {
     if (isEmpty(certificationData)) throw new HttpException(400, "Certificate data is required");
 
     const createCertificationData:any = await CertificationModel.create({ ...certificationData });
 
     return createCertificationData;
   }
 
   public async updateCertification(certificationId: string, certificationData: Certification): Promise<Certification> {
     if (isEmpty(certificationData)) throw new HttpException(400, "Certificate data is required");
 
     const updateCertificationById: Certification | null = await CertificationModel.findByIdAndUpdate(certificationId, certificationData);
     if (!updateCertificationById) throw new HttpException(409, "Failed to update certificate");
 
     return updateCertificationById;
   }
 
   public async deleteCertification(certificationId: string): Promise<Certification> {
     const deleteCertificationById: Certification | null = await CertificationModel.findByIdAndDelete(certificationId);
     if (!deleteCertificationById) throw new HttpException(409, "Failed to delete certificate");
 
     return deleteCertificationById;
   }
 }
 
 export default CertificationService;
 

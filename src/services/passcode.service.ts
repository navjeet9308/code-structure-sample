/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Passcode } from '@my-app/common/src/candidate/passcode.interface';
 import PasscodeModel from '../models/passcode.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class PasscodeService {
 
   public async findPasscode(): Promise<any[]> {
      const pcode: Passcode[] = await PasscodeModel.find();
      return pcode;
   }
   public async findAllPasscodeByName(name: string): Promise<any[]> {
    const pcode = await PasscodeModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return pcode;
  }
   
   
   public async findPasscodeById(passcodeId: string): Promise<Passcode> {
     if (isEmpty(passcodeId)) throw new HttpException(400, "Passcode Id is required");
 
     const pcode: Passcode | null = await PasscodeModel.findOne({ _id: passcodeId }!);
     if (!pcode) throw new HttpException(409, "Passcode not found ");
 
     return pcode;
   }
 
   public async createPasscode(passcodeData: Passcode): Promise<Passcode> {
     if (isEmpty(passcodeData)) throw new HttpException(400, "Passcode data is required");
 
     const pcode:any = await PasscodeModel.create({ ...passcodeData });
 
     return pcode;
   }
 
   public async updatePasscode(passcodeId: string, countryData: Passcode): Promise<Passcode> {
     if (isEmpty(countryData)) throw new HttpException(400, "Passcode data is required");
 
     const pcode: Passcode | null = await PasscodeModel.findByIdAndUpdate(passcodeId, countryData);
     if (!pcode) throw new HttpException(409, "Failed to update passcode");
 
     return pcode;
   }
 
   public async deletePasscode(passcodeId: string): Promise<Passcode> {
     const pcode: Passcode | null = await PasscodeModel.findByIdAndDelete(passcodeId);
     if (!pcode) throw new HttpException(409, "Failed to delete passcode");
 
     return pcode;
   }

   public async validatePasscode(filterObj: any): Promise<Passcode[]> {
    const pcode: any = await PasscodeModel.findOne(filterObj);
    return pcode;
  }
 }
 
 export default PasscodeService;
 

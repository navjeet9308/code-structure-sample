/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Sample } from '@my-app/common/src/sample/sample.interface';
 import sampleModel from '../models/sample.model';
 import { isEmpty } from '../utils/utility';
 
 class SampleService {
   public samples = sampleModel;
 
   public async findAllSample(): Promise<Sample[]> {
     const samples: Sample[] = await this.samples.find();
     return samples;
   }
 
   public async findSampleById(sampleId: string): Promise<Sample> {
     if (isEmpty(sampleId)) throw new HttpException(400, "You're not sampleId");
 
     const findSample: Sample | null = await this.samples.findOne({ _id: sampleId }!);
     if (!findSample) throw new HttpException(409, "You're not sample");
 
     return findSample;
   }
 
   public async createSample(sampleData: Sample): Promise<Sample> {
     if (isEmpty(sampleData)) throw new HttpException(400, "You're not sampleData");
 
     const createSampleData:any = await this.samples.create({ ...sampleData });
 
     return createSampleData;
   }
 
   public async updateSample(sampleId: string, sampleData: Sample): Promise<Sample> {
     if (isEmpty(sampleData)) throw new HttpException(400, "You're not sampleData");
 
     const updateSampleById: Sample | null = await this.samples.findByIdAndUpdate(sampleId, { sampleData });
     if (!updateSampleById) throw new HttpException(409, "You're not sample");
 
     return updateSampleById;
   }
 
   public async deleteSample(sampleId: string): Promise<Sample> {
     const deleteSampleById: Sample | null = await this.samples.findByIdAndDelete(sampleId);
     if (!deleteSampleById) throw new HttpException(409, "You're not sample");
 
     return deleteSampleById;
   }
 }
 
 export default SampleService;
 

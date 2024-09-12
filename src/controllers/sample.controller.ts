import { NextFunction, Request, Response } from 'express';
import { Sample } from '@my-app/common/src/sample/sample.interface';
import sampleService from '../services/sample.service';

class SampleController {
  public sampleService = new sampleService();

  public getSamples = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSamplesData: Sample[] = await this.sampleService.findAllSample();

      res.status(200).json({ data: findAllSamplesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getSampleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sampleId: string = req.params.id;
      const findOneSampleData: Sample = await this.sampleService.findSampleById(sampleId);

      res.status(200).json({ data: findOneSampleData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sampleData: any = req.body;
      const createSampleData: Sample = await this.sampleService.createSample(sampleData);

      res.status(201).json({ data: createSampleData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sampleId: string = req.params.id;
      const sampleData: any = req.body;
      const updateSampleData: Sample = await this.sampleService.updateSample(sampleId, sampleData);

      res.status(200).json({ data: updateSampleData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sampleId: string = req.params.id;
      const deleteSampleData: Sample = await this.sampleService.deleteSample(sampleId);

      res.status(200).json({ data: deleteSampleData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default SampleController;

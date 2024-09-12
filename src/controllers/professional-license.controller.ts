import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { ProfessionalLicense } from '@my-app/common/src/candidate/professional-license.interface';
import ProfessionalLicenseService from '../services/professional-license.service';
import { Service } from "typedi";
@Service()
class ProfessionalLicenseController {
  constructor(private readonly professionalLicenseService: ProfessionalLicenseService) { }
  public getProfessionalLicense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProfessionalLicenseData: ProfessionalLicense[] = await this.professionalLicenseService.findAllProfessionalLicense();
      res.status(200).json({ data: findAllProfessionalLicenseData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProfessionalLicenseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const professionalLicenseId: string = req.params.id;
      const findOneProfessionalLicenseData: ProfessionalLicense = await this.professionalLicenseService.findProfessionalLicenseById(professionalLicenseId);
      res.status(200).json({ data: findOneProfessionalLicenseData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProfessionalLicense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const professionalLicenseData: any = req.body;
      const createProfessionalLicenseData: ProfessionalLicense = await this.professionalLicenseService.createProfessionalLicense(professionalLicenseData);
      res.status(201).json({ data: createProfessionalLicenseData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProfessionalLicense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const professionalLicenseId: string = req.params.id;
      const professionalLicenseData: any = req.body;
      const updateProfessionalLicenseData: ProfessionalLicense = await this.professionalLicenseService.updateProfessionalLicense(professionalLicenseId, professionalLicenseData);
      res.status(200).json({ data: updateProfessionalLicenseData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProfessionalLicense= async (req: Request, res: Response, next: NextFunction) => {
    try {
      const professionalLicenseId: string = req.params.id;
      const deleteProfessionalLicenseData: ProfessionalLicense = await this.professionalLicenseService.deleteProfessionalLicense(professionalLicenseId);
      res.status(200).json({ data: deleteProfessionalLicenseData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfessionalLicenseController;

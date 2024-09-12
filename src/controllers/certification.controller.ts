import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Certification } from '@my-app/common/src/candidate/certification.interface';
import CertificationService from '../services/certification.service';
import { Service } from "typedi";
@Service()
class CertificationController {
  constructor(private readonly certificationService: CertificationService) { }
  public getCertification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCertificationData: Certification[] = await this.certificationService.findAllCertification();
      res.status(200).json({ data: findAllCertificationData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCertificationByName = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllCertificationData: Certification[] = await this.certificationService.findAllCertificationByName(name);
      res.status(200).json({ data: findAllCertificationData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };

  public getCertificationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificationId: string = req.params.id;
      const findOneCertificationData: Certification = await this.certificationService.findCertificationById(certificationId);
      res.status(200).json({ data: findOneCertificationData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCertification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificationData: any = req.body;
      const createCertificationData: Certification = await this.certificationService.createCertification(certificationData);
      res.status(201).json({ data: createCertificationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCertification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificationId: string = req.params.id;
      const certificationData: any = req.body;
      const updateCertificationData: Certification = await this.certificationService.updateCertification(certificationId, certificationData);
      res.status(200).json({ data: updateCertificationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCertification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificationId: string = req.params.id;
      const deleteCertificationData: Certification = await this.certificationService.deleteCertification(certificationId);
      res.status(200).json({ data: deleteCertificationData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CertificationController;

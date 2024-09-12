import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { CandidatePermission } from '@my-app/common/src/candidate/candidate-permission.interface';
import CandidatePermissionService from '../services/candidate-permission.service';
import { Service } from "typedi";
@Service()
class CandidatePermissionController {
  constructor(private readonly candidatePermissionService: CandidatePermissionService) { }

  public getCandidatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCandidatePermissionsData: CandidatePermission[] = await this.candidatePermissionService.findAllCandidatePermission();
      res.status(200).json({ data: findAllCandidatePermissionsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCandidatePermissionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidatePermissionId: string = req.params.id;
      const findOneCandidatePermissionData: CandidatePermission = await this.candidatePermissionService.findCandidatePermissionById(candidatePermissionId);
      res.status(200).json({ data: findOneCandidatePermissionData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCandidatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidatePermissionData: any = req.body;
      const createCandidatePermissionData: CandidatePermission = await this.candidatePermissionService.createCandidatePermission(candidatePermissionData);
      res.status(201).json({ data: createCandidatePermissionData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCandidatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidatePermissionId: string = req.params.id;
      const candidatePermissionData: any = req.body;
      const updateCandidatePermissionData: CandidatePermission = await this.candidatePermissionService.updateCandidatePermission(candidatePermissionId, candidatePermissionData);
      res.status(200).json({ data: updateCandidatePermissionData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCandidatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidatePermissionId: string = req.params.id;
      const deleteCandidatePermissionData: CandidatePermission = await this.candidatePermissionService.deleteCandidatePermission(candidatePermissionId);
      res.status(200).json({ data: deleteCandidatePermissionData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CandidatePermissionController;

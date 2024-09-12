import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { CandidateNotification } from '@my-app/common/src/candidate/candidate-notification.interface';
import CandidateNotificationService from '../services/candidate-notification.service';
import { Service } from "typedi";
@Service()
class CandidateNotificationController {
  constructor(private readonly candidateNotificationService: CandidateNotificationService) { }
  public getCandidateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCandidateNotificationsData: CandidateNotification[] = await this.candidateNotificationService.findAllCandidateNotification();
      res.status(200).json({ data: findAllCandidateNotificationsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCandidateNotificationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateNotificationId: string = req.params.id;
      const findOneCandidateNotificationData: CandidateNotification = await this.candidateNotificationService.findCandidateNotificationById(candidateNotificationId);
      res.status(200).json({ data: findOneCandidateNotificationData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCandidateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateNotificationData: any = req.body;
      const createCandidateNotificationData: CandidateNotification = await this.candidateNotificationService.createCandidateNotification(candidateNotificationData);
      res.status(201).json({ data: createCandidateNotificationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCandidateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateNotificationId: string = req.params.id;
      const candidateNotificationData: any = req.body;
      const updateCandidateNotificationData: CandidateNotification = await this.candidateNotificationService.updateCandidateNotification(candidateNotificationId, candidateNotificationData);
      res.status(200).json({ data: updateCandidateNotificationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCandidateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateNotificationId: string = req.params.id;
      const deleteCandidateNotificationData: CandidateNotification = await this.candidateNotificationService.deleteCandidateNotification(candidateNotificationId);
      res.status(200).json({ data: deleteCandidateNotificationData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CandidateNotificationController;

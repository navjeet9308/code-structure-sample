import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { CandidateResume } from '@my-app/common/src/candidate/candidate-resume.interface';
import CandidateResumeService from '../services/candidate-resume.service';
import { Service } from "typedi";
@Service()
class CandidateResumeController {
  constructor(private readonly candidateResumeService: CandidateResumeService) { }

  public getCandidateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const whereObj = {person_id:req.params.persion_id};
      const findAllCandidateResumesData: CandidateResume[] = await this.candidateResumeService.findAllCandidateResume(whereObj);
      res.status(200).json({ data: findAllCandidateResumesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCandidateResumeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateResumeId: string = req.params.id;
      const findOneCandidateResumeData: CandidateResume = await this.candidateResumeService.findCandidateResumeById(candidateResumeId);
      res.status(200).json({ data: findOneCandidateResumeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCandidateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateResumeData: any = req.body;
      const createCandidateResumeData: CandidateResume = await this.candidateResumeService.createCandidateResume(candidateResumeData);
      res.status(201).json({ data: createCandidateResumeData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCandidateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateResumeId: string = req.params.id;
      const candidateResumeData: any = req.body;
      const updateCandidateResumeData: CandidateResume = await this.candidateResumeService.updateCandidateResume(candidateResumeId, candidateResumeData);
      res.status(200).json({ data: updateCandidateResumeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCandidateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateResumeId: string = req.params.id;
      const deleteCandidateResumeData: CandidateResume = await this.candidateResumeService.deleteCandidateResume(candidateResumeId);
      res.status(200).json({ data: deleteCandidateResumeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CandidateResumeController;

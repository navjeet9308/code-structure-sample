import { NextFunction, Request, Response } from 'express';
import { Passcode } from '@my-app/common/src/candidate/passcode.interface';
import PasscodeService from '../services/passcode.service';
import { Service } from "typedi";
@Service()
class PasscodeController {
  constructor(private readonly passcodeService: PasscodeService) { }

  public getPasscode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPasscodesData: Passcode[] = await this.passcodeService.findPasscode();
      res.status(200).json({ data: findAllPasscodesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPasscodeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const findOnePasscodeData: Passcode = await this.passcodeService.findPasscodeById(jobOfferId);
      res.status(200).json({ data: findOnePasscodeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPasscode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferData: any = req.body;
      const createPasscodeData: Passcode = await this.passcodeService.createPasscode(jobOfferData);
      res.status(201).json({ data: createPasscodeData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePasscode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const jobOfferData: any = req.body;
      const updatePasscodeData: Passcode = await this.passcodeService.updatePasscode(jobOfferId, jobOfferData);
      res.status(200).json({ data: updatePasscodeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePasscode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobOfferId: string = req.params.id;
      const deletePasscodeData: Passcode = await this.passcodeService.deletePasscode(jobOfferId);
      res.status(200).json({ data: deletePasscodeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public validatePasscode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const passcode: any = req.body && req.body.passcode ? req.body.passcode : '';
      const match: any = await this.passcodeService.validatePasscode({code:passcode});
      res.status(201).json({ data: match, message: 'passcode matched' });
    } catch (error) {
      next(error);
    }
  };
}

export default PasscodeController;

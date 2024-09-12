import { NextFunction, Request, Response } from 'express';
import { PreviousSearch } from '@my-app/common/src/candidate/previous-search.interface';
import PreviousSearchService from '../services/previous-search.service';
import { Service } from "typedi";
@Service()
class PreviousSearchController {
  constructor(private readonly previousSearchService: PreviousSearchService) { }

  public getPreviousSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPreviousSearchsData: PreviousSearch[] = await this.previousSearchService.findAllPreviousSearch(req.body);
      res.status(200).json({ data: findAllPreviousSearchsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPreviousSearchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previousSearchId: string = req.params.id;
      const findOnePreviousSearchData: PreviousSearch = await this.previousSearchService.findPreviousSearchById(previousSearchId);
      res.status(200).json({ data: findOnePreviousSearchData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPreviousSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previousSearchData: any = req.body;
      const createPreviousSearchData: PreviousSearch = await this.previousSearchService.createPreviousSearch(previousSearchData);
      res.status(201).json({ data: createPreviousSearchData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePreviousSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previousSearchId: string = req.params.id;
      const previousSearchData: any = req.body;
      const updatePreviousSearchData: PreviousSearch = await this.previousSearchService.updatePreviousSearch(previousSearchId, previousSearchData);
      res.status(200).json({ data: updatePreviousSearchData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePreviousSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previousSearchId: string = req.params.id;
      const deletePreviousSearchData: PreviousSearch = await this.previousSearchService.deletePreviousSearch(previousSearchId);
      res.status(200).json({ data: deletePreviousSearchData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default PreviousSearchController;

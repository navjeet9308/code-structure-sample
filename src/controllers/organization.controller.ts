import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Organization } from '@my-app/common/src/candidate/organization.interface';
import OrganizationService from '../services/organization.service';
import { Service } from "typedi";
@Service()
class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }
  public getOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllOrganizationData: Organization[] = await this.organizationService.findAllOrganization();
      res.status(200).json({ data: findAllOrganizationData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getOrganizationByName = async (req: Request, res: Response, next: NextFunction) => {
    console.log('getOrganizationByName',req.query);
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      console.log('getOrganizationByName--',name)
      const findAllOrganizationData: Organization[] = await this.organizationService.findAllOrganizationByName(name);
      res.status(200).json({ data: findAllOrganizationData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };
  

  public getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId: string = req.params.id;
      const findOneOrganizationData: Organization = await this.organizationService.findOrganizationById(organizationId);
      res.status(200).json({ data: findOneOrganizationData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationData: any = req.body;
      const createOrganizationData: Organization = await this.organizationService.createOrganization(organizationData);
      res.status(201).json({ data: createOrganizationData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId: string = req.params.id;
      const organizationData: any = req.body;
      const updateOrganizationData: Organization = await this.organizationService.updateOrganization(organizationId, organizationData);
      res.status(200).json({ data: updateOrganizationData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId: string = req.params.id;
      const deleteOrganizationData: Organization = await this.organizationService.deleteOrganization(organizationId);
      res.status(200).json({ data: deleteOrganizationData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default OrganizationController;

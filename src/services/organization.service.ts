/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Organization } from '@my-app/common/src/candidate/organization.interface';
 import OrganizationModel from '../models/organization.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class OrganizationService {
 
   public async findAllOrganization(): Promise<Organization[]> {
     const organizations: Organization[] = await OrganizationModel.find();
     return organizations;
   }
   public async findAllOrganizationByName(name: string): Promise<any[]> {
    const organizations = await OrganizationModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
    return organizations;
  }

   public async getOrganizationIds(companyName: any): Promise<any> {
     let organization: any = await OrganizationModel.findOne({ title: { $regex: companyName, $options: 'i' } });
     if (!(organization && organization.title)) {
        organization = await OrganizationModel.create({ title: companyName } );
     }
     return organization;
   }
 
   public async findOrganizationById(organizationId: string): Promise<Organization> {
     if (isEmpty(organizationId)) throw new HttpException(400, "Please provid organization Id");
 
     const findOrganization: Organization | null = await OrganizationModel.findOne({ _id: organizationId }!);
     if (!findOrganization) throw new HttpException(409, "Organization not found");
 
     return findOrganization;
   }
 
   public async createOrganization(organizationData: Organization): Promise<Organization> {
     if (isEmpty(organizationData)) throw new HttpException(400, "Organization data is required");
 
     const createOrganization:any = await OrganizationModel.create({ ...organizationData });
 
     return createOrganization;
   }
 
   public async updateOrganization(organizationId: string, organizationData: Organization): Promise<Organization> {
     if (isEmpty(organizationData)) throw new HttpException(400, "Organization data is required");
 
     const updateOrganizationById: Organization | null = await OrganizationModel.findByIdAndUpdate(organizationId, organizationData);
     if (!updateOrganizationById) throw new HttpException(409, "Failed to update Organization");
 
     return updateOrganizationById;
   }
 
   public async deleteOrganization(organizationId: string): Promise<Organization> {
     const deleteOrganizationById: Organization | null = await OrganizationModel.findByIdAndDelete(organizationId);
     if (!deleteOrganizationById) throw new HttpException(409, "Failed to delete Organization");
 
     return deleteOrganizationById;
   }
 }
 
 export default OrganizationService;
 

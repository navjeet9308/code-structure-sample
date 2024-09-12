/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Skill } from '@my-app/common/src/candidate/skill.interface';
 import axios from "axios"
 import SkillModel from '../models/skill.model';
 import { isEmpty } from '../utils/utility';
 import {META_DATA_BASE_URL} from "./../config";
 import { Service } from "typedi";
 @Service()
 class SkillService {
 
   public async findAllSkill(): Promise<Skill[]> {
     const skills: Skill[] = await SkillModel.find();
     return skills;
   }
   public async findAllSkillByName(name: string): Promise<any[]> {   
     const skills: any = await axios.post(`${META_DATA_BASE_URL}/api/v1/skill/skills`, { // Will use this from Env File
       where: { name: `${name}` }
     }) 
  //  const skills = await SkillModel.find({title: { $regex: name, $options : 'i' }}).sort({title: 1}).limit(10);
     return skills && skills.data && skills.data.data || [];    
  }
 
   public async findSkillById(skillId: string): Promise<Skill> {
     if (isEmpty(skillId)) throw new HttpException(400, "Please provide skill Id");
 
     const findSkill: Skill | null = await SkillModel.findOne({ _id: skillId }!);
     if (!findSkill) throw new HttpException(409, "Skill not found.");
 
     return findSkill;
   }
 
   public async createSkill(skillData: Skill): Promise<Skill> {
     if (isEmpty(skillData)) throw new HttpException(400, "Please provide skill data.");
 
     const createSkillData:any = await SkillModel.create({ ...skillData });
 
     return createSkillData;
   }
 
   public async updateSkill(skillId: string, skillData: Skill): Promise<Skill> {
     if (isEmpty(skillData)) throw new HttpException(400, "Please provide skill data.");
 
     const updateSkillById: Skill | null = await SkillModel.findByIdAndUpdate(skillId, skillData);
     if (!updateSkillById) throw new HttpException(409, "Skill not updated, try again");
 
     return updateSkillById;
   }
 
   public async deleteSkill(skillId: string): Promise<Skill> {
     const deleteSkillById: Skill | null = await SkillModel.findByIdAndDelete(skillId);
     if (!deleteSkillById) throw new HttpException(409, "Skill not deleted, try again");
 
     return deleteSkillById;
   }
 }
 
 export default SkillService;
 

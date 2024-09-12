import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Skill } from '@my-app/common/src/candidate/skill.interface';
import SkillService from '../services/skill.service';
import { Service } from "typedi";
@Service()
class SkillController {
  constructor(private readonly skillService: SkillService) { }
  public getSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSkillData: Skill[] = await this.skillService.findAllSkill();
      res.status(200).json({ data: findAllSkillData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getSkillByName = async (req: Request, res: Response, next: NextFunction) => {
    console.log('getSkillByName',req.query.name)
    if (typeof req.query.name === "string") {
      const name = req.query.name ? req.query.name : '';
      const findAllSkillData: Skill[] = await this.skillService.findAllSkillByName(name);
      res.status(200).json({ data: findAllSkillData, message: 'findAll' });
    } else {
      next(new Error('Please send the params in right format'));
    } 
  };

  public getSkillById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillId: string = req.params.id;
      const findOneSkillData: Skill = await this.skillService.findSkillById(skillId);
      res.status(200).json({ data: findOneSkillData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillData: any = req.body;
      const createSkillData: Skill = await this.skillService.createSkill(skillData);
      res.status(201).json({ data: createSkillData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillId: string = req.params.id;
      const skillData: any = req.body;
      const updateSkillData: Skill = await this.skillService.updateSkill(skillId, skillData);
      res.status(200).json({ data: updateSkillData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillId: string = req.params.id;
      const deleteSkillData: Skill = await this.skillService.deleteSkill(skillId);
      res.status(200).json({ data: deleteSkillData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default SkillController;

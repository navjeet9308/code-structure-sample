import mongoose from "mongoose";
import BaseSchema from "./base.model";
const skillSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef SkillModel
 */
const SkillModel = mongoose.model("Skill", skillSchema, "skills");

export default SkillModel;
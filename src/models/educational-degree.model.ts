import mongoose from "mongoose";
import BaseSchema from "./base.model";
import { instituteVOSchema } from "./shared.model";
const educationDegreeSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef EducationDegreeModel
 */
const EducationDegreeModel = mongoose.model("EducationDegree", educationDegreeSchema, "education-degrees");

export default EducationDegreeModel;
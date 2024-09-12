import mongoose from "mongoose";
import BaseSchema from "./base.model";
const educationInstituteSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    country:{type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef EducationInstituteModel
 */
const EducationInstituteModel = mongoose.model("EducationInstitute", educationInstituteSchema, "education-institutes");

export default EducationInstituteModel;
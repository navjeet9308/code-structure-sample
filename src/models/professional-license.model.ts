import mongoose from "mongoose";
import BaseSchema from "./base.model";
const professionalLicenseSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    expiry_date: { type: Date}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef ProfessionalLicenseModel
 */
const ProfessionalLicenseModel = mongoose.model("ProfessionalLicense", professionalLicenseSchema, "professional-licenses");

export default ProfessionalLicenseModel;
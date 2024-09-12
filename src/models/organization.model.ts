import mongoose from "mongoose";
import BaseSchema from "./base.model";
const organizationSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    year_from: { type: Date},
    year_to: { type: Date},
    currentlyWorking:{ type: Boolean, default: false },
    responsibility:{type: String},
    employment_type:{type: String},
    designation:{type: String},
    location:{type: String},
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef OrganizationModel
 */
const OrganizationModel = mongoose.model("Organization", organizationSchema, "organizations");

export default OrganizationModel;
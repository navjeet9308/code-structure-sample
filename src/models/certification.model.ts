import mongoose from "mongoose";
import BaseSchema from "./base.model";
const certificationSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    year_from: { type: Date},
    year_to: { type: Date},
    expiry_date: { type: Date }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef CertificationModel
 */
const CertificationModel = mongoose.model("Certification", certificationSchema, "certifications");

export default CertificationModel;
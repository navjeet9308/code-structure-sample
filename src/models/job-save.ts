import mongoose from "mongoose";
import BaseSchema from "./base.model";
const saveJobSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    save_by_id: { type: String, required: true },
    job_id: {type: String, required: true},
    job_company_name: { type: String },
    job_title: { type: String, required: true},
    job_location: { type: String, required: true},
    job_exprince: {type: String, required: true},
    execution_at: { type: Date, required: true }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef SaveJobModel
 */
const SaveJobModel = mongoose.model("SaveJobs", saveJobSchema, "save-jobs");

export default SaveJobModel;
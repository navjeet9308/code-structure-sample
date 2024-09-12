import mongoose from "mongoose";
import BaseSchema from "./base.model";
const jobApplicationSchema = new mongoose.Schema(
  { ...BaseSchema.obj,
    applied_by_candidate: { type: String, required: true },
    candidate_sfdcId: { type: String, required: true },
    job_order_id: { type: String, required: true },
    applied_on: { type: Date, required: true },
    is_cancelled:{ type: Boolean, default: false },
    resume: { type: String },
    applied_as_guest: { type: Boolean, default: false },
    bgv_consent_given:{type: Date},
    guest_full_name: { type: String, required: true },
    guest_email: { type: String, required: true },
    guest_phone: { type: String, required: true },
    job_company_name: { type: String },
    job_title: { type: String },
    job_location: { type: String },
    job_exprince: { type: String },
    sfdc_id: { type: String },
    application_stage: { type: String, default: 'Application' }, 
    name:{type: String},
    hiring_manager:{type: String},
    secondary_recruiter:{type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef jobApplication
 */
const JobApplicationModel = mongoose.model("JobApplication", jobApplicationSchema,"job-applications");

export default JobApplicationModel;

import mongoose from "mongoose";
import BaseSchema from "./base.model";
import {
  interViewRoundVOSchema
} from './shared.model';

const JobCaqSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    sfdc_id: { type: String },    
    scheduled_at: { type: Date},
    interview_rounds: interViewRoundVOSchema,
    last_updated_at: { type: Date},
    job_application_id: { type: String },
    job_order_id: { type: String },
    job_order_title: { type: String },
    client_interview_needed: { type: String },
    is_deleted: { type: Boolean, default: false },
    currency_iso: { type: String },
    status: { type: String }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef JobCaq
 */
const JobCaqModel = mongoose.model("JobCaq", JobCaqSchema,"job-Caq");

export default JobCaqModel;

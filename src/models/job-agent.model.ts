import { EmailFrequencyType } from "../utils/common.enum";
import mongoose from "mongoose";
import BaseSchema from "./base.model";
const jobAgentSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    keywords: [{ type: String }],
    locations: [{ type: String}],
    experience_from: { type: Number, default: 0 },
    experience_to: { type: Number, default: 0 }, 
    allow_email_notifications: { type: Boolean, default: false },
    email_frequency: { type: String, enum: EmailFrequencyType }      
  },
  {
      timestamps: true,
  }
  
);

/**
 * @typedef JobAgent
 */
const JobAgentModel = mongoose.model("JobAgent", jobAgentSchema ,"job-agents");

export default JobAgentModel;

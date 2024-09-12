import { CandidateNotificationType } from "../utils/common.enum";
import mongoose from "mongoose";
import BaseSchema from "./base.model";
const candidateNotificationSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    candidate_id: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: CandidateNotificationType },    
  },
  {
      timestamps: true,
  }
  
);

/**
 * @typedef CandidateNotification
 */
const CandidateNotificationModel = mongoose.model("CandidateNotification", candidateNotificationSchema ,"candidate-notifications");

export default CandidateNotificationModel;

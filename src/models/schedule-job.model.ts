import { PermissionType } from "../utils/common.enum";
import mongoose from "mongoose";
import BaseSchema from "./base.model";
const scheduleJobSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    name: { type: String, required: true },
    execution_pattern: { type: String, required: true },
    execution_at: { type: Date, required: true },
    opration_type: { type: String, enum: PermissionType },    
  },
  {
      timestamps: true,
  }
  
);

/**
 * @typedef ScheduleJob
 */
const ScheduleJobModel = mongoose.model("ScheduleJob", scheduleJobSchema ,"schedule-jobs");

export default ScheduleJobModel;

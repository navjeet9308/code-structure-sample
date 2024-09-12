import { PermissionType } from "../utils/common.enum";
import mongoose from "mongoose";
import BaseSchema from "./base.model";
const previousSearchSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    search_by_id: { type: String, required: true },
    execution_pattern: { type: Object, required: true },
    execution_at: { type: Date, required: true },
    opration_type: { type: String, enum: PermissionType },    
  },
  {
      timestamps: true,
  }
  
);

/**
 * @typedef PreviousSearch
 */
const PreviousSearchModel = mongoose.model("PreviousSearch", previousSearchSchema ,"previous-searches");

export default PreviousSearchModel;

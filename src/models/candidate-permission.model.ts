import mongoose from "mongoose";
import BaseSchema from "./base.model";
import {PermissionType} from '../utils/common.enum';

const candidatePermissionSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    candidate_id: {type: String},
    permission_type: { type: String, enum: PermissionType},
    last_permitted_on: { type: Date},
    is_active: { type: Boolean, default: false }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef candidatePermission
 */
const CandidatePermissionModel = mongoose.model("CandidatePermission", candidatePermissionSchema,"candidate-permissions");

export default CandidatePermissionModel;

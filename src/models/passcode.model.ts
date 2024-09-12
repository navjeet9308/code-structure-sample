import mongoose from "mongoose";
import BaseSchema from "./base.model";
import {referencesSchema
} from './shared.model';
const passcodeSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    person_id: { type: String },  
    references: referencesSchema,
    code: { type: String},
    expire_at: { type: String},
    is_submitted: { type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef passcodeSchema
 */
const PasscodeModel = mongoose.model("Passcode", passcodeSchema,"passcode");

export default PasscodeModel;

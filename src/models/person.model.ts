import mongoose from "mongoose";
import BaseSchema from "./base.model";
const personSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    full_name: {type: String},
    email: { type: String},
    phone: { type: String},
    gender: { type: String},
    password: { type: String },
    otp:{ type: Number },
    verify_otp: {type: Boolean, default: false},
    verify_email: {type: Boolean, default: false},
    sfdc_id: { type: String},
    picture:{type: String},
    socialAuthSub: {type: String},
    linkedLoginIn: {type: Boolean, default: false},
    googleLoginIn: {type: Boolean, default: false},
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef PersonModel
 */
const PersonModel = mongoose.model("Person", personSchema, "persons");

export default PersonModel;
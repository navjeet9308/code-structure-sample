import mongoose from "mongoose";
import BaseSchema from "./base.model";
const stateSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    country_id: { type: String},
    sfdcId: { type: String},
    currency_iso_code:  { type: String},
    is_active: { type: Boolean, default: true }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef StateModel
 */
const StateModel = mongoose.model("State", stateSchema, "states");

export default StateModel;
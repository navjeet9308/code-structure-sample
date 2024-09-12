import mongoose from "mongoose";
import BaseSchema from "./base.model";
const countrySchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    country_code: { type: String},
    sfdcId: { type: String},
    region: {type: String},
    is_active: { type: Boolean, default: true }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef CountryModel
 */
const CountryModel = mongoose.model("Country", countrySchema, "countries");

export default CountryModel;
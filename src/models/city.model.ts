import mongoose from "mongoose";
import BaseSchema from "./base.model";
const citySchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    county_id: { type: String},
    state_id: { type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef CityModel
 */
const CityModel = mongoose.model("City", citySchema, "cities");

export default CityModel;
import mongoose from "mongoose";
import BaseSchema from "./base.model";
const languageSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    is_active: { type: Boolean, default: true }
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef LanguageModel
 */
const LanguageModel = mongoose.model("Language", languageSchema, "languages");

export default LanguageModel;
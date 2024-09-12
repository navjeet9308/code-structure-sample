import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    launchDate: { type: Date, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Sample
 */
const sampleModel = mongoose.model("Sample", sampleSchema);

export default sampleModel;

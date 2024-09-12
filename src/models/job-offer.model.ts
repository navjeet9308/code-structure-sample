import mongoose from "mongoose";
import BaseSchema from "./base.model";

const jobOfferSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    job_order_id: { type: String, required: true },
    job_application_id: { type: String, required: true },
    released_by: { type: String, required: true },
    expiry_duration_in_days: { type: String, required: true },
    sfdc_id: { type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef jobOffer
 */
const JobOfferModel = mongoose.model("JobOffer", jobOfferSchema,"job-offers");

export default JobOfferModel;

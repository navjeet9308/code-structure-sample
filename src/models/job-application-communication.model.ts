import mongoose from "mongoose";
import BaseSchema from "./base.model";

const jobApplicationCommunicationSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    job_application_id: { type: String, required: true },
    message: { type: String, required: true },
    sfdc_id: { type: String}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef JobApplicationCommunication
 */
const JobApplicationCommunicationModel = mongoose.model("JobApplicationCommunication", jobApplicationCommunicationSchema,"job-application-communications");

export default JobApplicationCommunicationModel;

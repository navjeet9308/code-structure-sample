import mongoose from "mongoose";
import BaseSchema from "./base.model";
import { latestResumeVOSchema } from "./shared.model";

const candidateResumeSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    person_id: { type: String },    
    url: { type: String},
    fileMeta: latestResumeVOSchema,
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef CandidateResume
 */
const CandidateResumeModel = mongoose.model("CandidateResume", candidateResumeSchema,"candidate-resume");

export default CandidateResumeModel;

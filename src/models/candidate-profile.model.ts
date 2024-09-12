import mongoose from "mongoose";
import BaseSchema from "./base.model";
import {
  jobPreferenceVOSchema, skillVOSchema, employmentVOSchema, educationsVOSchema,
  certificationsVOSchema, professionalLicencesVOSchema, profileCompletenessVOSchema,
  languagesVOSchema,skillsAndExpVOSchema,consentVOSchema, socialLinksVOSchema, coursesVOSchema,
  addressVOSchema, jobBoardSourceVOSchema
} from './shared.model';
const candidateProfileSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    person_id: { type: String },   
    full_name: {type: String},
    email: { type: String},
    phone: { type: String},
    gender: { type: String}, 
    latest_resume: { type: String},
    picture:{type: String},
    total_experience: { type: String, default: '0' },
    address: addressVOSchema,
    jobboard_source: jobBoardSourceVOSchema,
    job_preference: jobPreferenceVOSchema,
    citizen_ships: { type: String },
    skills: [skillVOSchema],
    employment_history: [employmentVOSchema],
    educations: [educationsVOSchema],
    certifications: [certificationsVOSchema],
    professional_licences: [professionalLicencesVOSchema],
    profile_completeness: [profileCompletenessVOSchema],
    completeness_percentage: { type: Number, default: 0 },
    languages: [languagesVOSchema],
    social_links: [socialLinksVOSchema],
    courses: [coursesVOSchema],
    about_you:{ type: String },
    profile_title:{type: String},
    consent:[consentVOSchema]
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef candidateProfile
 */
const CandidateProfileModel = mongoose.model("CandidateProfile", candidateProfileSchema,"candidate-profiles");

export default CandidateProfileModel;

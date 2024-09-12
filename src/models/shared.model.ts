import { WorkerType, WorkLocation, EmploymentType, PayoutType, TitleMatchType,SkillLevelTypeVOSchema} from '../utils/common.enum';
import {PermissionType} from '../utils/common.enum';
const payoutTypeVOSchema = {
  value: { type: Number },
  type: { type: String, enum: PayoutType }
};
const title_match_criteriaVOSchema = {
  id: { type: String },
  titles: [{ type: String }],
  type : { type: String, enum:TitleMatchType}
};
const countryVOSchema = {
  label: { type: String },
  value: { type: String }, 
  key: { type: String },
}
const stateVOSchema = {
  label: { type: String },
  value: { type: String }, 
  key: { type: String },
}


const jobPreferenceVOSchema = {
  id: { type: String },
  preffred_job_type: { type: String },
  notice: { type: String },
  locations: { type: String },
  desiredLocations: {type: String},
  open_to_relocate : { type: Boolean, default: false },
  open_to_onsite : { type: Boolean, default: false },
  open_to_remote : { type: Boolean, default: false },
  worker_type: { type: String, enum: WorkerType},
  work_location: { type: String, enum: WorkLocation},
  employment_type: { type: String, enum: EmploymentType },
  current_payout_type: payoutTypeVOSchema,
  expected_payout_type: payoutTypeVOSchema,
  title_match_criteria: [title_match_criteriaVOSchema],
  country: countryVOSchema,
  state: stateVOSchema,
  city: { type: String },
  zip: { type: String },
  timezone: { type: String },
  job_preference: { type: String },
};
const workAuthorizationVOSchema = {
  label: { type: String },
  value: { type: String }, 
  key: { type: String },
}
const skillVOSchema = {
  id: { type: String },
  title: { type: String },
  level:{ type: String}
};
const employmentTypeVOSchema = {
  label: { type: String },
  value: { type: String }, 
  key: { type: String }
}
const employmentVOSchema = {
  id: { type: String },
  title: { type: String },
  year_from: { type: Date},
  year_to: { type: Date},
  responsibility:{ type: String },
  currently_working:{ type: Boolean, default: false },
  designation:{ type: String },
  location:{ type: String },
  employment_type: [employmentTypeVOSchema]
};

const skillsAndExpVOSchema = {
  id: { type: String },
  title: { type: String },
  year_from: { type: Date},
  year_to: { type: Date},
  description: { type: String }
};
const instituteVOSchema = {
  label: { type: String },
  value: { type: String }, 
  key: { type: String }
}
const educationsVOSchema = {
  id: { type: String },
  title: { type: String },
  year_from: { type: Date},
  year_to: { type: Date},
  description: { type: String },
  duration_type:{type: String},
  institute:instituteVOSchema
};

const certificationsVOSchema = {
  id: { type: String },
  title: { type: String },
  year_from: { type: Date},
  year_to: { type: Date},
  valid_till: { type: String},
  description:{type: String }
};

const professionalLicencesVOSchema = {
  id: { type: String },
  title: { type: String },
  year: { type: Number},
  valid_till: { type: Number}
};

const profileCompletenessVOSchema = {
  category: { type: String },
  weightage: { type: Number },
  is_complete : { type: String },
  candidate_id: { type: String }
};

const latestResumeVOSchema = {
  id: { type: String },
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  destination: { type: String },
  filename: { type: String },
  path: { type: String },
  size: { type: Number }
};
const adaptabilityScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const attitudeScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const accountabilityScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const communicationScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const customerServiceFocusScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const driveScoreVOSchema ={
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const innovationScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const integrityScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const leadershipScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const passionScoreVOSchema = {
  id: { type: String },
  rating: { type: String },
  comment: { type: String },
  score: { type: Number }
}
const interViewRoundVOSchema = {
  id: { type: String },
  sfdc_id: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  interviewer_id: { type: String },
  interviewer_name: { type: String },
  meeting_link: { type: String },
  is_cancelled: { type: String },
  primary_interviewer_feedback: { type: String },
  other_interviewer_feedback: { type: String },
  is_client_round: { type: Boolean, default: false },
  other_interviewer_name: { type: String },
  other_interviewer_id: { type: String },
  status: { type: String },
  comment: { type: String },
  adaptability_score: adaptabilityScoreVOSchema,
  attitude_score: attitudeScoreVOSchema,
  accountability_score: accountabilityScoreVOSchema,
  communication_score: communicationScoreVOSchema,
  customer_srvice_focus_score: customerServiceFocusScoreVOSchema,
  drive_score: driveScoreVOSchema,
  innovation_score: innovationScoreVOSchema,
  integrity_score: integrityScoreVOSchema,
  leadership_score: leadershipScoreVOSchema,
  passion_score: passionScoreVOSchema,
  overall_score: { type: Number },
  overall_comment: { type: String }
}

const languagesVOSchema = {
  id: { type: String },
  title: { type: String },
  fluency_level: { type: String }
}
const consentVOSchema = {
  permission_type: { type: String, enum: PermissionType},
  last_permitted_on: { type: Date}
}

const socialLinksVOSchema = {
  id: { type: String },
  name: { type: String },
  profile_link: { type: String}  
};
const coursesVOSchema = {
  id: { type: String },
  name: { type: String } 
};

const coordinatesVOSchema = {
  latitude: {type: Number},
  longitude: {type: Number}
}

const addressVOSchema = {
  street_name: { type: String },
  country: countryVOSchema,
  state: stateVOSchema,
  city: { type: String },
  zip: { type: String },
  geocode: coordinatesVOSchema
}

const jobBoardSourceVOSchema = {
  jobboard_id: { type: String },
  jobboard_name: { type: String },
  person_id: {type: String},
  sfdcId: {type: String}
}
const referencesSchema = {
  app_name:{ type: String },
  app_sfdc_id:{ type: String },
  que_set:{ type: String },
  que_name:{ type: String },
  job_name:{ type: String },
  job_title:{ type: String },
  candidate_name:{type: String }
}

export { jobPreferenceVOSchema, skillVOSchema, employmentVOSchema, educationsVOSchema,
  certificationsVOSchema, professionalLicencesVOSchema, profileCompletenessVOSchema,
  latestResumeVOSchema,interViewRoundVOSchema, adaptabilityScoreVOSchema,attitudeScoreVOSchema,
  accountabilityScoreVOSchema, communicationScoreVOSchema,customerServiceFocusScoreVOSchema,
  driveScoreVOSchema, innovationScoreVOSchema, integrityScoreVOSchema, leadershipScoreVOSchema, passionScoreVOSchema,
  languagesVOSchema,skillsAndExpVOSchema,employmentTypeVOSchema,workAuthorizationVOSchema,instituteVOSchema,consentVOSchema,
  socialLinksVOSchema,coursesVOSchema,addressVOSchema, jobBoardSourceVOSchema,referencesSchema };


  
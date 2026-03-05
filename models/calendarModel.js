const mongoose = require("mongoose");

const jobseekerDetailsSchema = new mongoose.Schema({
  jobseekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recruiterAddProfiles"
  },

  empStatus: {
    type: String,
    default: ""
  }

}, { _id: false });


const recruiterAddProfilesSchema = new mongoose.Schema({

  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contests",
    required: true
  },


  user_details: {
    nameOfTheOrganisation: {
      type: String
    }
  },

  jobseekerDetails: [jobseekerDetailsSchema]

}, { timestamps: true });


module.exports = mongoose.model(
  "recruiterAddProfiles",
  recruiterAddProfilesSchema
);
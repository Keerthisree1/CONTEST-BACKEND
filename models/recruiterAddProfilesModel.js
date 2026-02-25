const mongoose = require("mongoose");

const recruiterAddProfilesSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    employerName: {
      type: String,
      required: true,
    },

    contestName: {
      type: String,
      required: true,
    },

    jobseekerDetails: [
      {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "RecruiterAddProfiles",
  recruiterAddProfilesSchema,
  "recruiterAddProfiles"
);
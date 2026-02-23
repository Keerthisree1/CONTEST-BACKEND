const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },

    contestStatus: {
      type: String,
      index: true
    },

    contestPlanType: {
      type: String,
      index: true
    },

    details: {
      jdUrl: {
        type: String
      },
      jobDetails: {
        jobTitle: {
          type: String,
          index: true
        },
        experience: {
          type: String,
          index: true
        },
        budget: {
          type: String
        },
        noOfPositions: {
          type: Number,
          index: true
        }
      }
    }
  },
  {
    collection: "contests",
    timestamps: true
  }
);

ContestSchema.index({ contestStatus: 1, "details.jobDetails.noOfPositions": 1 });

//
const contestsSchema = new mongoose.Schema(
  {
    contestName: String,
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('Contest', contestsSchema);


const RecruiterAddProfiles = require("../models/recruiterAddProfilesModel");

exports.getActiveContestOverview = async (req, res) => {
  try {
    const data = await RecruiterAddProfiles.aggregate([
      { $unwind: "$jobseekerDetails" },

      {
        $group: {
          _id: "$contestId",

          // contest name
          contestName: { $first: "$role" },

          // createdAt
          createdAt: { $first: "$jobseekerDetails.createdAt" },

          // employer name = first + last
          firstName: { $first: "$jobseekerDetails.firstName" },
          lastName: { $first: "$jobseekerDetails.lastName" },

          total: { $sum: 1 },

          Drafted: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Drafted"] }, 1, 0]
            }
          },

          Completed: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Completed"] }, 1, 0]
            }
          },

          ProfilesSubmitted: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Submitted"] }, 1, 0]
            }
          },

          ProfilesShortlisted: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Shortlisted"] }, 1, 0]
            }
          },

          L1: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "L1"] }, 1, 0]
            }
          },

          L2: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "L2"] }, 1, 0]
            }
          },

          L3: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "L3"] }, 1, 0]
            }
          },

          HR: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "HR"] }, 1, 0]
            }
          },

          Onhold: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Onhold"] }, 1, 0]
            }
          },

          OfferSent: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Offer Sent"] }, 1, 0]
            }
          },

          Onboarded: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Onboarded"] }, 1, 0]
            }
          },

          Rejected: {
            $sum: {
              $cond: [{ $eq: ["$jobseekerDetails.status", "Rejected"] }, 1, 0]
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          contestId: "$_id",
          employerName: { $concat: ["$firstName", " ", "$lastName"] },
          contestName: 1,
          createdAt: 1,
          total: 1,
          Drafted: 1,
          Completed: 1,
          ProfilesSubmitted: 1,
          ProfilesShortlisted: 1,
          L1: 1,
          L2: 1,
          L3: 1,
          HR: 1,
          Onhold: 1,
          OfferSent: 1,
          Onboarded: 1,
          Rejected: 1
        }
      }

    ]).allowDiskUse(true);

    res.status(200).json({
      success: true,
      totalContests: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const Marketplace = require("../models/marketplaceModel");

exports.getContestOverview = async (req, res) => {
  try {

    const data = await Marketplace.aggregate([

      { $unwind: "$jobseekerDetails" },

      {
        $group: {
          _id: "$contestId",

          total: { $sum: 1 },

          profilesSubmitted: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.status", "Submitted"] },
                1,
                0
              ]
            }
          },

          profilesShortlisted: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.status", "Shortlisted"] },
                1,
                0
              ]
            }
          },

          l1: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.empStatus", "L1"] },
                1,
                0
              ]
            }
          },

          l2: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.empStatus", "L2"] },
                1,
                0
              ]
            }
          },

          hr: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.empStatus", "HR"] },
                1,
                0
              ]
            }
          },

          onboarded: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.empStatus", "Onboarded"] },
                1,
                0
              ]
            }
          },

          rejected: {
            $sum: {
              $cond: [
                { $eq: ["$jobseekerDetails.status", "Rejected"] },
                1,
                0
              ]
            }
          }
        }
      },

      // Join Contest
      {
        $lookup: {
          from: "contests",
          localField: "_id",
          foreignField: "_id",
          as: "contest"
        }
      },
      { $unwind: "$contest" },

      // Join Employer
      {
        $lookup: {
          from: "users",
          localField: "contest.employerId",
          foreignField: "_id",
          as: "employer"
        }
      },
      { $unwind: "$employer" },

      {
        $project: {
          contestId: "$_id",
          contestName: "$contest.contestName",
          employerName: {
            $concat: ["$employer.firstName", " ", "$employer.lastName"]
          },
          total: 1,
          profilesSubmitted: 1,
          profilesShortlisted: 1,
          l1: 1,
          l2: 1,
          hr: 1,
          onboarded: 1,
          rejected: 1
        }
      }

    ]);

    res.status(200).json({
      success: true,
      totalContests: data.length,
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
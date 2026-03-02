const RecruiterAddProfiles = require("../models/recruiterAddProfilesModel");
const mongoose = require("mongoose");

exports.getActiveContestOverview = async (req, res) => {
  try {
    const { page, limit, contestName, employerName, empStatus, contestId } = req.query;

    let pipeline = [];

    //Match contestId
    if (contestId && mongoose.Types.ObjectId.isValid(contestId)) {
      pipeline.push({
        $match: {
          contestId: new mongoose.Types.ObjectId(contestId)
        }
      });
    }

    //Unwind jobseekerDetails
    pipeline.push({ $unwind: "$jobseekerDetails" });

    //Filter by empStatus
    if (empStatus) {
      pipeline.push({
        $match: {
          "jobseekerDetails.empStatus": empStatus
        }
      });
    }

    //Group before lookup
    pipeline.push({
      $group: {
        _id: "$contestId",

        employerName: {
          $first: {
            $concat: [
              "$jobseekerDetails.firstName",
              " ",
              "$jobseekerDetails.lastName"
            ]
          }
        },

        createdAt: { $first: "$jobseekerDetails.createdAt" },

        total: { $sum: 1 },

        Drafted: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "drafted"] }, 1, 0] }
        },
        Submitted: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "Submitted"] }, 1, 0] }
        },
        Shortlisted: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "Shortlisted"] }, 1, 0] }
        },
        Completed: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "completed"] }, 1, 0] }
        },
        L1: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "L1"] }, 1, 0] }
        },
        L2: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "L2"] }, 1, 0] }
        },
        L3: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "L3"] }, 1, 0] }
        },
        HR: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "HR"] }, 1, 0] }
        },
        Onhold: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "Onhold"] }, 1, 0] }
        },
        OfferSent: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "OfferSent"] }, 1, 0] }
        },
        Onboarded: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "OnBoard"] }, 1, 0] }
        },
        Rejected: {
          $sum: { $cond: [{ $eq: ["$jobseekerDetails.empStatus", "Rejected"] }, 1, 0] }
        }
      }
    });

    //Lookup 
    pipeline.push(
      {
        $lookup: {
          from: "contests",
          localField: "_id",
          foreignField: "contestId",
          as: "contestData"
        }
      },
      {
        $unwind: {
          path: "$contestData",
          preserveNullAndEmptyArrays: true
        }
      }
    );

    //contestName field
    pipeline.push({
      $addFields: {
        contestName: "$contestData.details.jobDetails.jobTitle"
      }
    });

    //filter: contestName
    if (contestName) {
      pipeline.push({
        $match: {
          contestName: { $regex: contestName, $options: "i" }
        }
      });
    }

    //filter: employerName
    if (employerName) {
      pipeline.push({
        $match: {
          employerName: { $regex: employerName, $options: "i" }
        }
      });
    }

    //Final projection
    pipeline.push({
      $project: {
        _id: 0,
        contestId: "$_id",
        employerName: 1,
        contestName: 1,
        createdAt: 1,
        total: 1,
        Drafted: 1,
        Submitted: 1,
        Shortlisted: 1,
        Completed: 1,
        L1: 1,
        L2: 1,
        L3: 1,
        HR: 1,
        Onhold: 1,
        OfferSent: 1,
        Onboarded: 1,
        Rejected: 1
      }
    });

    //Sort
    pipeline.push({ $sort: { createdAt: -1 } });

    //Apply pagination
    if (page && limit) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      if (!isNaN(pageNumber) && !isNaN(limitNumber)) {
        const skip = (pageNumber - 1) * limitNumber;
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limitNumber });
      }
    }

    //Execute
    const data = await RecruiterAddProfiles.aggregate(pipeline);

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
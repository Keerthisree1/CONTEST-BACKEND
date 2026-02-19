const Contest = require("../models/contestModel");
const mongoose = require("mongoose");

exports.getContests = async (req, res) => {
  try {
    const {
      contestId,
      contestStatus,
      jobTitle,
      experience,
      budget,
      jdUrl,
      positions,
      contestType
    } = req.query;

    let filter = {};

    if (contestId) {
      filter.contestId = new mongoose.Types.ObjectId(contestId);
    }

    if (contestStatus) {
      filter.contestStatus = contestStatus;
    }

    if (jobTitle) {
      filter["details.jobDetails.jobTitle"] = {
        $regex: jobTitle,
        $options: "i"
      };
    }

    if (experience) {
      filter["details.jobDetails.experience"] = {
        $regex: experience,
        $options: "i"
      };
    }


    if (budget) {
      filter["details.jobDetails.budget"] = {
        $regex: budget,
        $options: "i"
      };
    }


    if (jdUrl) {
      filter["details.jdUrl"] = {
        $regex: jdUrl,
        $options: "i"
      };
    }

    if (positions) {
      filter["details.jobDetails.noOfPositions"] = Number(positions);
    }

    if (contestType) {
      filter["contestPlanType"] = contestType;
    }

    const contests = await Contest.find(filter).lean();

    res.json({
      success: true,
      total: contests.length,
      data: contests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
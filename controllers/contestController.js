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
      contestType,
      page,
      limit
    } = req.query;

    let filter = {};

    //Filters
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

    //Pagination
    let query = Contest.find(filter).sort({ createdAt: -1 });

    // Apply pagination ONLY if page & limit exist
    if (page && limit) {
   const pageNumber = parseInt(page);
   const limitNumber = parseInt(limit);
   const skip = (pageNumber - 1) * limitNumber;

    query = query.skip(skip).limit(limitNumber);
    }

    const contests = await query.lean();

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

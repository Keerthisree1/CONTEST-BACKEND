const Contest = require("../models/contestModel");

exports.getContests = async (req, res) => {
  try {
    const { status } = req.query;

    const statusMap = {
      active: ["Active"],
      closed: ["Completed"],
      completed: ["Completed"],
      rejected: ["Rejected"],
      "in-review": ["In-Review"],
      "on-hold": ["On Hold"],
      all: ["Active", "Completed", "Rejected", "In-Review", "On Hold"]
    };

    let filter = {};

    if (status && statusMap[status]) {
      filter.contestStatus = { $in: statusMap[status] };
    }

    const contests = await Contest.find(filter);

    res.json({
      success: true,
      total: contests.length,
      data: contests
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//filter

const mongoose = require("mongoose");

exports.getContests = async (req, res) => {
  try {
    const { contestId, status, title, experience, budget } = req.query;

    let filter = {};

    if (contestId) {
      filter.contestId = new mongoose.Types.ObjectId(contestId);
    }

    if (status) {
      filter.contestStatus = status;
    }

    if (title) {
      filter["details.jobDetails.jobTitle"] = {
        $regex: title,
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

    const contests = await Contest.find(filter);

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

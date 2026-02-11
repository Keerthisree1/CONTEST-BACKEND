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

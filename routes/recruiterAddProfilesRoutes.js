const express = require("express");
const router = express.Router();

const {
  getActiveContestOverview,
} = require("../controllers/recruiterAddProfilesController");

router.get("/active-contest-overview", getActiveContestOverview);

module.exports = router;
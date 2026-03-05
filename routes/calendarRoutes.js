const express = require("express");
const router = express.Router();

const {
  getCalendarContestView
} = require("../controllers/calendarController");

router.get("/calendar-contests", getCalendarContestView);

module.exports = router;
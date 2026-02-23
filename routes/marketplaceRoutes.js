const express = require('express');
const router = express.Router();

const { getContestOverview } = require('../controllers/contestController');

router.get('/contest-overview', getContestOverview);

module.exports = router;

const express = require('express');
const router = express.Router();

const { getContests } = require('../controllers/contestController');

router.get('/contests', getContests);

module.exports = router;

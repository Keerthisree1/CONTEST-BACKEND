const mongoose = require('mongoose');

const jobseekerSchema = new mongoose.Schema({
  status: String,       // Submitted, Rejected, Shortlisted etc
  empStatus: String     // L1, L2, HR, Onboarded etc
});

const marketplaceSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest"
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  jobseekerDetails: [jobseekerSchema]
});

module.exports = mongoose.model('Marketplace', marketplaceSchema);
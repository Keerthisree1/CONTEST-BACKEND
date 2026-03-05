const RecruiterAddProfiles = require("../models/recruiterAddProfilesModel");

exports.getCalendarContestView = async (req, res) => {
  try {

    const data = await RecruiterAddProfiles.aggregate([

      // break jobseekerDetails
      { $unwind: "$jobseekerDetails" },

      // remove drafted / empty
      {
        $match: {
          "jobseekerDetails.empStatus": {
            $nin: ["drafted", "", null]
          }
        }
      },

      // group by contest
      {
        $group: {
          _id: {
            contestId: "$contestId"
          },
          employerName: {
            $first: "$user_details.nameOfTheOrganisation"
          },
          profilesSubmitted: { $sum: 1 }
        }
      },

      {
        $setWindowFields: {
          sortBy: { "_id.contestId": 1 },
          output: {
            contestNumber: { $documentNumber: {} }
          }
        }
      },

      // contest name
      {
        $addFields: {
          contestName: {
            $concat: ["Contest ", { $toString: "$contestNumber" }]
          }
        }
      },

      {
        $project: {
          _id: 0,
          contestId: "$_id.contestId",
          employerName: 1,
          contestName: 1,
          profilesSubmitted: 1
        }
      }

    ]);

    res.status(200).json({
      success: true,
      totalContests: data.length,
      data
    });

  } catch (error) {
    console.error("Calendar Contest Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
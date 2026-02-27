const Application = require("../models/Application");
const DsaProblem = require("../models/DsaProblem");
const Interview = require("../models/Interview");
const Resume = require("../models/Resume");

const getStats = async (req, res) => {
  try {
    const userId = req.user;

    const applications = await Application.countDocuments({ user: userId });
    const dsaProblems = await DsaProblem.countDocuments({ user: userId });
    const interviews = await Interview.countDocuments({ user: userId });
    const resumes = await Resume.countDocuments({ user: userId });

    res.json({
      applications,
      dsaProblems,
      interviews,
      resumes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };

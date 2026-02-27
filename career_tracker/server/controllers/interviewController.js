const Interview = require("../models/Interview");

// Create interview
const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({
      ...req.body,
      user: req.user,
    });
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all interviews
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete interview
const deleteInterview = async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  deleteInterview,
};

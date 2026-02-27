const DsaProblem = require("../models/DsaProblem");

// Create problem
const createProblem = async (req, res) => {
  try {
    const problem = await DsaProblem.create({
      ...req.body,
      user: req.user,
    });
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all problems
const getProblems = async (req, res) => {
  try {
    const problems = await DsaProblem.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete problem
const deleteProblem = async (req, res) => {
  try {
    await DsaProblem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProblem,
  getProblems,
  deleteProblem,
};

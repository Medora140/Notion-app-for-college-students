const Application = require("../models/Application");

// Create application
const createApplication = async (req, res) => {
  try {
    const app = await Application.create({
      ...req.body,
      user: req.user,
    });
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications
const getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};

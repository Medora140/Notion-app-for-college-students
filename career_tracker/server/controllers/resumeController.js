const Resume = require("../models/Resume");

// Upload resume
const uploadResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user,
      filename: req.file.filename,
      originalName: req.file.originalname,
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  deleteResume,
};

const Resume = require("../models/Resume");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const officeParser = require("officeparser");

// Helper function to extract text
const extractText = async (filePath, mimeType) => {
  try {
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } 
    
    if (fileExt === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    if (fileExt === ".pptx" || fileExt === ".ppt") {
      return new Promise((resolve, reject) => {
        officeParser.parseOffice(filePath, (data, err) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    }

    return ""; // Fallback for unsupported types
  } catch (error) {
    console.error("Extraction error:", error);
    return "";
  }
};

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const extractedText = await extractText(filePath, req.file.mimetype);

    const resume = await Resume.create({
      user: req.user,
      filename: req.file.filename,
      originalName: req.file.originalname,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
      text: extractedText, // Send text back to frontend
    });
  } catch (error) {
    console.error("Upload controller error:", error);
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

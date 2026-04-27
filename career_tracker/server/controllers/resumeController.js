const Resume = require("../models/Resume");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts text from various file types using buffers.
 * Hardened for production with fallback for empty/short text.
 */
const extractTextFromBuffer = async (buffer, originalName, mimetype) => {
  const extension = path.extname(originalName).toLowerCase();
  console.log(`[DEBUG] Filename: ${originalName}`);
  console.log(`[DEBUG] Mimetype: ${mimetype}`);
  console.log(`[DEBUG] Parsing file type: ${extension}`);

  let text = "";

  try {
    if (extension === ".pdf") {
      const data = await pdfParse(buffer);
      text = data.text || "";
      console.log("[DEBUG] pdf-parse finished");
    } else if (extension === ".docx") {
      const result = await mammoth.extractRawText({ buffer: buffer });
      text = result.value || "";
      console.log("[DEBUG] mammoth finished");
    } else if (extension === ".pptx" || extension === ".ppt") {
      console.log("[DEBUG] PPTX detected - returning fallback message");
      return "PPTX parsing not supported yet. Please paste resume text manually.";
    } else {
      console.log("[DEBUG] Unsupported extension");
      return "Unsupported file type for extraction. Please paste text manually.";
    }

    // Clean up the text: remove excessive whitespace and empty lines
    text = text.replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();

    console.log(`[DEBUG] Extracted text length: ${text.length}`);

    // Fallback if extraction is too short or empty (likely scanned PDF or image-based DOCX)
    if (!text || text.length < 20) {
      console.log("[DEBUG] Extraction result too short. Returning fallback message.");
      return "Could not extract meaningful text from this file (it might be a scanned image). Please paste your resume text manually below.";
    }

    return text;
  } catch (error) {
    console.error(`[ERROR] Parsing failed for ${originalName}:`, error.message);
    return "Could not extract text from this file. Please paste your resume manually.";
  }
};

/**
 * Upload Resume Controller
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      console.log("[DEBUG] Upload attempt with no file");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { buffer, originalname, mimetype } = req.file;
    
    // 1. Manually save file to disk (to keep existing download functionality)
    const filename = Date.now() + "-" + originalname;
    const uploadPath = path.join(__dirname, "../", "../", "uploads", filename);
    
    // Ensure uploads directory exists
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(uploadPath, buffer);
    console.log(`[DEBUG] File saved successfully to: ${uploadPath}`);

    // 2. Extract text from buffer with hardening logic
    const extractedText = await extractTextFromBuffer(buffer, originalname, mimetype);

    // 3. Save reference to Database
    const resume = await Resume.create({
      user: req.user,
      filename: filename,
      originalName: originalname,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
      text: extractedText,
    });
  } catch (error) {
    console.error("[CRITICAL ERROR] uploadResume Controller:", error.message);
    res.status(500).json({ 
      message: "Server error during upload", 
      text: "Extraction failed due to a server error. Please paste manually." 
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      const filePath = path.join(__dirname, "../", "../", "uploads", resume.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
      await Resume.findByIdAndDelete(req.params.id);
      console.log(`[DEBUG] Deleted file and DB record for: ${resume.filename}`);
    }
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

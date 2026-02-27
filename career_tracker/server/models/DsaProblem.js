const mongoose = require("mongoose");

const dsaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    platform: {
      type: String,
      default: "LeetCode",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DsaProblem", dsaSchema);

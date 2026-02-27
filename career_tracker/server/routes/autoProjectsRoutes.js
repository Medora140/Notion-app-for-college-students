const express = require("express");
const router = express.Router();
const { generateProjects } = require("../controllers/autoProjectsController");

router.post("/projects", generateProjects);

module.exports = router;

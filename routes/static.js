const path = require("path");
const express = require("express");
const router = express.Router();

// Serve the entire public folder
router.use(express.static(path.join(__dirname, "..", "public")));

// Optional: explicit subfolders (not required, but allowed)
router.use("/css", express.static(path.join(__dirname, "..", "public", "css")));
router.use("/js", express.static(path.join(__dirname, "..", "public", "js")));
router.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

module.exports = router;



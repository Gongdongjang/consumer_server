const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// logout
router.post("/logout", async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.send();
});

module.exports = router;

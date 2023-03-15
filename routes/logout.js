const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// logout
router.get("/logout", async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.send();
  console.log("로그아웃")
});

module.exports = router;

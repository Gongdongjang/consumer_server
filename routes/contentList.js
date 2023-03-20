const pool = require("../db");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");

router.get("/", async (req, res) => {
  let return_content;
  // 소비자용
  const [contents, fields] = await pool.execute(
    `SELECT * FROM content WHERE is_tmp = 0 AND upload_date < CURRENT_DATE() ORDER BY content_date DESC`
  );
  return_content = contents;
  res.send(return_content);
});

router.get("/banner", async (req, res) => {
  try {
    const [result, field] = await pool.execute(
      `SELECT * FROM content WHERE promotion_banner IS NOT NULL ORDER BY promotion_banner ASC`
    );

    res.send({
      msg: "BANNER_CONTENT_READ_SUCCESS",
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "BANNER_CONTENT_READ_FAIL",
    });
  }
});

module.exports = router;

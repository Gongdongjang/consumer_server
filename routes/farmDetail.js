const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/farmDetail", async (req, res, next) => {
  const {farm_id, md_count} = req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    const data = await pool.query(`SELECT * FROM md where farm_id = ?`, [
      farm_id,
    ]);
    resultCode = 200;
    message = "성공";
    let md_name = new Array();
    // let md_count = new Array();
    // let md_id = new Array();
    let md_start = new Array(); //나중에 pu로 꼭!!!! 바꿔야함
    let md_end = new Array();
    for (let i = 0; i < md_count; i++) {
      md_name[i] = data[0][i].md_name;
      md_start[i] = data[0][i].md_start;
      md_end[i] = data[0][i].md_end;
    }
    // console.log(md_name);
    return res.json({
      code: resultCode,
      message: message,
      md_name: md_name,
      md_start: md_start,
      md_end: md_end,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

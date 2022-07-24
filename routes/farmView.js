const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/farmView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행

    const [result] = await pool.execute(`SELECT * FROM farm`);

    const [md_result] = await pool.execute(
      `SELECT * FROM md LEFT JOIN farm ON md.farm_id = farm.farm_id`
    );

    return res.json({
      code: resultCode,
      message: message,
      //farm 관련 정보
      result: result,
      //상세 페이지 관련 정보
      md_result: md_result,

    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

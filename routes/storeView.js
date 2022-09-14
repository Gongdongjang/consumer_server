const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/storeView", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const [store_result] = await pool.execute(
      `SELECT store_id, store_name, store_info, store_hours, store_loc FROM store`
    );

    let count = await pool.query("SELECT COUNT(*) FROM store");
    count = count[0][0]["COUNT(*)"];

    resultCode = 200;
    message = "storeView 성공";

    //사용자주소 추가하기.
    //const [distance_result]=

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      store_result: store_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

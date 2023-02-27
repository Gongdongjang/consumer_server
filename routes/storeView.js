const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/storeView", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const [store_result] = await pool.execute(
      `SELECT * FROM store join pickup on store.store_id = pickup.store_id join md on pickup.md_id = md.md_id join payment on md.md_id = payment.md_id`
    );

    let count = store_result.length;

    let pu_start = new Array();
    for (let i = 0; i < store_result.length; i++) {
      pu_start[i] = new Date(store_result[i].pu_start).toLocaleDateString();
    }

    resultCode = 200;
    message = "storeView 성공";

    //사용자주소 추가하기.
    //const [distance_result]=

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      pu_start: pu_start,
      store_result: store_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

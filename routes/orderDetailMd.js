const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const {order_id} = req.body;

  try {
    //문제 없으면 try문 실행
    let [pu_date] = await pool.execute(
      `SELECT order_pu_date FROM ggdjang.order WHERE order_id = ${order_id}`
    );

    pu_date = new Date(pu_date[0].order_pu_date).toLocaleDateString();

    resultCode = 200;
    message = "orderDetailMd 성공";

    return res.json({
      code: resultCode,
      message: message,
      pu_date: pu_date,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/jointPurchase", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT * FROM payment");
    //결제 예정일
    const pay_schedule = data[0][0].pay_schedule;
    //상품 금액
    const pay_price = data[0][0].pay_price;
    //세트 구성 정보
    const pay_comp = data[0][0].pay_comp;
    //할인 정보
    const pay_dc = data[0][0].pay_dc;

    var count = await pool.query("SELECT COUNT(*) FROM payment");
    console.log("22행");
    console.log(data[0]);
    count = count[0][0]["COUNT(*)"];
    console.log(count);
    payment = data[0];

    return res.json({
      code: resultCode,
      message: message,
      pay_schedule: pay_schedule,
      pay_price: pay_price,
      pay_comp: pay_comp,
      pay_dc: pay_dc,
      count: count,
      payment: payment,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const {order_id} = req.body;

  try {
    //문제 없으면 try문 실행
    const [order_detail] = await pool.execute(
      `SELECT * FROM ggdjang.order join md_Img on md_Img.md_id = order.md_id WHERE order_id = ${order_id}`
    );

    //상품 현재 상태
    let [md_status] = await pool.execute(
      `SELECT stk_confirm FROM ggdjang.stock WHERE md_id = ${order_detail[0].md_id}`
    );

    let pu_date = new Date(order_detail[0].order_pu_date).toLocaleDateString();

    resultCode = 200;
    message = "orderDetailMd 성공";

    return res.json({
      code: resultCode,
      message: message,
      order_detail: order_detail,
      md_status: md_status[0],
      pu_date: pu_date,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

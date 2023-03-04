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
      `SELECT md_id, order_pu_time, order_md_status, order_select_qty, order_price FROM order.order_cancel = 0 and ggdjang.order WHERE order_id = ${order_id}`
    );

    //상품 현재 상태
    let [md_status] = await pool.execute(
      `SELECT stk_confirm FROM ggdjang.stock WHERE md_id = ${order_detail[0].md_id}`
    );

    resultCode = 200;
    message = "orderDetailMd 성공";

    return res.json({
      code: resultCode,
      message: message,
      order_detail: order_detail,
      md_status: md_status[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

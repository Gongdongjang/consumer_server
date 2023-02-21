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
      `SELECT order_pu_time FROM ggdjang.order WHERE order_id = ${order_id}`
    );

    const [order_detail] = await pool.execute(
      `SELECT md_id, order_pu_time, order_md_status, order_select_qty, order_price FROM ggdjang.order WHERE order_id = ${order_id}`
    );

    let [md_status] = await pool.execute(
      `SELECT stk_confirm FROM ggdjang.stock WHERE md_id = ${order_detail[0].md_id}`
    );

    // console.log(order_detail); // 이거쓰기 pu_date도
    // console.log(md_status[0]);

    pu_date = new Date(pu_date[0].order_pu_time).toLocaleDateString();
    //console.log(pu_date);

    resultCode = 200;
    message = "orderDetailMd 성공";

    return res.json({
      code: resultCode,
      message: message,
      pu_date: pu_date,
      order_detail: order_detail,
      md_status: md_status[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

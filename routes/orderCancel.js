const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  const {order_id} = req.body;
  let select_qty, md_id;

  //문제 없으면 try문 실행
  try {

    const [stock_info] = await pool.execute(`SELECT order_select_qty, md_id FROM ggdjang.order WHERE order_id = ${order_id}`);

    //주문취소
    const order_cancel= await pool.execute(`DELETE FROM ggdjang.order WHERE order_id = ${order_id}`);
    resultCode = 200;
    message = "orderCancel 성공";

    select_qty=stock_info[0].order_select_qty;
    md_id=stock_info[0].md_id;

    //주문취소 후 재고 늘려주기
    const stock_remain= await pool.execute(`UPDATE stock SET stk_remain=stk_remain+${select_qty} WHERE md_id=${md_id}`);
    //주문취소 후 총 주문수량 줄여주기
    const stock_total= await pool.execute(`UPDATE stock SET stk_total=stk_total-${select_qty} WHERE md_id=${md_id}`);

    return res.json({
      code: resultCode,
      message: message,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
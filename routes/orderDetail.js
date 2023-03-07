const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const {user_id} = req.body;

  try {
    //문제 없으면 try문 실행
    const [order_detail] = await pool.execute(
      `SELECT * FROM ggdjang.order join store on ggdjang.order.store_id = store.store_id join payment on payment.md_id = ggdjang.order.md_id join md on ggdjang.order.md_id = md.md_id join md_Img on md_Img.md_id = md.md_id WHERE order.order_cancel = 0 and ggdjang.order.user_id = ${user_id}`
    );
    
    const [order_cancel] = await pool.execute(
      `SELECT order_id, order_select_qty, order_pu_date, order_md_status, store_name, store_loc, pay_price, mdimg_thumbnail, md_name FROM ggdjang.order join store on ggdjang.order.store_id = store.store_id join payment on payment.md_id = ggdjang.order.md_id join md on ggdjang.order.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id WHERE order.order_cancel = 1 and ggdjang.order.user_id = ${user_id}`

    );

    let pu_date = new Array();
    for (let i = 0; i < order_detail.length; i++) {
      pu_date[i] = new Date(order_detail[i].order_pu_date).toLocaleDateString();
    }

    resultCode = 200;
    message = "orderDetail 성공";

    //사용자주소 추가하기.
    //const [distance_result]=

    return res.json({
      code: resultCode,
      message: message,
      order_detail: order_detail,
      pu_date: pu_date,
      order_cancel: order_cancel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

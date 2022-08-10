const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  console.log(req.body);
  let {user_id, md_id, store_id, select_qty, pu_date, pu_time} =
  req.body;

  md_id=Number(md_id);
  store_id=Number(store_id);
  select_qty=Number(select_qty.substr(0, 1));

  const order_pu_date= new Date(pu_date);   //문자열을 날짜형으로 변환
  const order_date=new Date();
  const order_pu_time=new Date(pu_date+" "+pu_time+":00");
  console.log(pu_date+" "+pu_time+":00");

  console.log(order_date,order_pu_date,order_pu_time);

  try {
    //문제 없으면 try문 실행
    const [order_insert] = await pool.execute(
      `INSERT INTO gdjang.order (order_select_qty, order_pu_date, order_date, order_md_status, order_pu_time, user_id, md_id, store_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
      [select_qty,order_pu_date,order_date,"준비중",order_pu_time,user_id,md_id,store_id]
    );

    // let pu_date = new Array();
    // for (let i = 0; i < order_detail.length; i++) {
    //   pu_date[i] = new Date(order_detail[i].order_pu_date).toLocaleDateString();
    // }

    resultCode = 200;
    message = "orderInsert 성공";

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
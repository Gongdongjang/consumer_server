const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  let {user_id, md_id, store_id, select_qty, order_price, pu_date, pu_time} = req.body;
  
  md_id=Number(md_id);
  store_id=Number(store_id);

  const order_pu_date= new Date(pu_date);   //문자열을 날짜형으로 변환
  const order_date=new Date();
  const order_pu_time=new Date(pu_date+" "+pu_time+":00");

  //console.log(order_date,order_pu_date,order_pu_time);

  try {
    //문제 없으면 try문 실행
    const [order_insert] = await pool.execute(
      `INSERT INTO ggdjang.order (order_select_qty, order_pu_date, order_date, order_md_status, order_pu_time, order_price, user_id, md_id, store_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [select_qty,order_pu_date,order_date,"준비중",order_pu_time,order_price,user_id,md_id,store_id]
    );
    resultCode = 200;
    message = "orderInsert 성공";

    //결제 성공 후 재고 줄여주기
    const stock_remain= await pool.execute(`UPDATE stock SET stk_remain=stk_remain-${select_qty} WHERE md_id=${md_id}`);
    //총 주문수량 늘려주기
    const stock_total= await pool.execute(`UPDATE stock SET stk_total=stk_total+${select_qty} WHERE md_id=${md_id}`);
    // stk_total = select sum(order_select_qty) from `order` join md on md.md_id = `order`.md_id where md.md_id = 5;

    //order_id 보내기
    const [order_id] = await pool.execute(
      `SELECT LAST_INSERT_ID() FROM ggdjang.order WHERE user_id = ${user_id}`
    );

    return res.json({
      code: resultCode,
      message: message,
      order_id: order_id[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
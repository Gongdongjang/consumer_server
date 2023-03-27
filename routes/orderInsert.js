const pool = require("../db");
const express = require("express");
const firebase = require('firebase-admin');
const firebaseCredential = require("../gdjang_firebase.json");
const router = express.Router();


router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  let {user_id, md_id, store_id, select_qty, order_price, pu_date, pu_time, order_name, md_name} = req.body;
  
  md_id=Number(md_id);
  store_id=Number(store_id);

  const order_pu_date= new Date(pu_date);   //문자열을 날짜형으로 변환
  const order_date=new Date();
  const order_pu_time=new Date(pu_date+" "+pu_time+":00");


  //문제 없으면 try문 실행
  try {

    //유저이름,토큰 찾기
    const u_data = await pool.query("SELECT user_no, user_name, fcm_token FROM user WHERE user_id=? ",[user_id]);
    userno= u_data[0][0].user_no;
    user_name = u_data[0][0].user_name;
    target_token=u_data[0][0].fcm_token;


    let m_title= md_name+ " 무통장 입금 안내";
    let m_content="안녕하세요. "+user_name+"님. 무통장 입금 계좌 안내드립니다. 은행 : 우리은행 계좌번호 : 1002-363-127161 예금주 : 김민서 금액 : "+ order_price+"원 입금 확인 시간은 매일 11-15시/18-22시 진행됩니다. 문의사항은 [마이페이지 > 고객센터 > 문의하기]를 사용해주세요.";

    //order테이블에 값 insert
    [order_insert] = await pool.execute(
      `INSERT INTO ggdjang.order (order_select_qty, order_pu_date, order_date, order_md_status, order_pu_time, order_price, user_id, md_id, store_id, user_name, order_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [select_qty,order_pu_date,order_date,"준비중",order_pu_time,order_price,user_id,md_id,store_id,user_name,order_name]
    );
   // console.log("orderInsertID");
   // console.log(order_insert.insertId);
    resultCode = 200;
    message = "orderInsert 성공";

    //console.log(user_id);

    //결제성공 알림 보내기
    let msg = {
      notification: {                
        title: m_title,
        body: m_content,
       },
      data: {
        title: m_title,
        body: m_content,
        userId: user_id,
      },
        token: target_token
      }
  
      firebase
      .messaging()
      .send(msg)
      .then(function (response) {
      })
      .catch(function (err) {
      });


    //결제 성공 후 재고 줄여주기
    const stock_remain= await pool.execute(`UPDATE stock SET stk_remain=stk_remain-${select_qty} WHERE md_id=${md_id}`);
    //총 주문수량 늘려주기
    const stock_total= await pool.execute(`UPDATE stock SET stk_total=stk_total+${select_qty} WHERE md_id=${md_id}`);
    // stk_total = select sum(order_select_qty) from `order` join md on md.md_id = `order`.md_id where md.md_id = 5;

    //장바구니 리스트 삭제하기
    const cart_delete= await pool.execute(`DELETE FROM cart WHERE user_id = ? and store_id = ? and md_id= ?`, [user_id, store_id, md_id]);
    //console.log(cart_delete);

    //order_id 보내기
    [order_id] = await pool.execute(
      `SELECT LAST_INSERT_ID() FROM ggdjang.order WHERE user_id = ?`, [user_id]
    );

    //알림테이블에 추가
    let result;
    [result]= await pool.execute(`INSERT INTO notification (notification_title, notification_content, notification_type, notification_target,
      notification_push_type, notification_date) VALUES (?, ?, ?, ?, ?, ?)`, [m_title, m_content, "결제알림", "개인", "실시간", order_date]);
    
    await pool.execute(`INSERT INTO notification_by_user (notification_user, notification_id, status) VALUES (?, ?, ?)`,
      [userno, result.insertId, 'SENT']);

    return res.json({
      code: resultCode,
      message: message,
      order_id: order_insert.insertId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
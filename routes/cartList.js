const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/cartPost", async (req, res, next) => {
  const {user_id, md_id, store_id, pu_date, pu_time, purchase_num} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const [cart_result] = await pool.execute(
      `SELECT COUNT(store_id) store_id FROM cart WHERE user_id = ? and md_id = ?`, [user_id, md_id]
    );

    if (cart_result[0]["store_id"] == 0){
      const [cart_post] = await pool.execute(
        `INSERT INTO cart (user_id, md_id, store_id, select_qty, cart_pu_date, cart_pu_time) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, md_id, store_id, purchase_num, pu_date, pu_time]
      );
      resultCode = 200;
      message = "cartDetail 성공";
    }

    else {
      const [cart_post] = await pool.execute(
        `UPDATE cart SET select_qty = select_qty + ? where user_id = ? and md_id = ?`,
        [purchase_num, user_id, md_id]
      );

      resultCode = 200;
      message = "cartDetail 성공";
    }

    return res.json({
      code: resultCode,
      message: message
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/cartList", async (req, res, next) => {
  let user_id = req.query.user_id;
  try {
    const [cart_detail] = await pool.execute(
      `SELECT user_id, cart.store_id, cart.md_id, stk_remain, select_qty, cart_pu_date, cart_pu_time, store_name, pay_price, md_name, pay_comp, mdimg_thumbnail from ggdjang.cart join store on ggdjang.cart.store_id = store.store_id join payment on payment.md_id = ggdjang.cart.md_id join md on ggdjang.cart.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id join stock on md.md_id=stock.md_id WHERE ggdjang.cart.user_id = ${user_id}`
    );

    const [store_count] = await pool.execute(
      `SELECT COUNT(*) from (SELECT DISTINCT store_name cart_id, user_id, select_qty, cart_pu_date, cart_pu_time, store_name, pay_price, md_name, pay_comp, mdimg_thumbnail FROM ggdjang.cart join store on ggdjang.cart.store_id = store.store_id join payment on payment.md_id = ggdjang.cart.md_id join md on ggdjang.cart.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id WHERE ggdjang.cart.user_id = ${user_id}) A;`
    );
    resultCode = 200;
    message = "orderDetail 성공";
    
    return res.json({
      code: resultCode,
      message: message,
      cart_detail: cart_detail,
      store_count: store_count,
    }); 
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/cartList", async (req, res, next) => {
  //cart_id 리스트로 받고 싶음
  const {cart_id, user_id, select_qty, cart_pu_date, cart_pu_time, store_name, pay_price, md_name, pay_comp} = req.body;
  let before_count = req.body.before_count;
  let after_count = req.body.after_count;
  console.log(before_count, "<=>", after_count);

  try {
    console.log("cart  post")
    // 선택한 것만 intent

    if (before_count == after_count){
      const cart_update = await pool.query(
        `UPDATE cart SET select_qty = ? where cart_id = ?`,
        [select_qty, user_id]
      );

      message="update";
      return res.json({
          code: resultCode,
          message: message,
          cart_update:cart_update,
      });
    }
    if (before_count != after_count){   //여러개 삭제면? //리사이클러 loc으로 삭제
      for (let i = 0; i < before_count - after_count; i++){
        //cart_id 리스트로 받아야하나
        const cart_delete = await pool.query(
          "DELETE FROM cart WHERE cart_id=?",
          [select_qty, user_id]
        );
      }
      message="delete";
      return res.json({
          code: resultCode,
          message: message,
          cart_delete:cart_delete,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/cartDelete", async (req, res, next) => {
  let user_id = req.query.user_id;
  let store_id = req.query.store_id;
  let md_id = req.query.md_id;
  const [cart_delete] = await pool.execute(
    `DELETE FROM cart WHERE user_id=? and store_id=? and md_id=?`,[user_id, store_id, md_id]
  );
});

module.exports = router;
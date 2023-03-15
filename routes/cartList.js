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
      message = "cart post 성공";
    }

    else {
      const [cart_post] = await pool.execute(
        `UPDATE cart SET select_qty = select_qty + ? where user_id = ? and md_id = ?`,
        [purchase_num, user_id, md_id]
      );

      resultCode = 200;
      message = "cart post 성공";
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
      `SELECT user_id, cart.store_id, cart.md_id, stk_remain, select_qty, cart_pu_date, cart_pu_time, store_loc, store_name, pay_price, md_name, pay_comp, mdimg_thumbnail from ggdjang.cart join store on ggdjang.cart.store_id = store.store_id join payment on payment.md_id = ggdjang.cart.md_id join md on ggdjang.cart.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id join stock on md.md_id=stock.md_id WHERE ggdjang.cart.user_id = ${user_id}`
    );

    const [store_count] = await pool.execute(
      `SELECT COUNT(*) from (SELECT DISTINCT store_name cart_id, user_id, select_qty, cart_pu_date, cart_pu_time, store_name, pay_price, md_name, pay_comp, mdimg_thumbnail FROM ggdjang.cart join store on ggdjang.cart.store_id = store.store_id join payment on payment.md_id = ggdjang.cart.md_id join md on ggdjang.cart.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id WHERE ggdjang.cart.user_id = ${user_id}) A;`
    );
    resultCode = 200;
    message = "cart_detail get 성공";
    
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

router.get("/cartUpdate", async (req, res, next) => {
  let select_qty = req.query.select_qty;
  let user_id = req.query.user_id;
  let store_id = req.query.store_id;
  let md_id = req.query.md_id;
  try {
    const [cart_update] = await pool.execute(
      `UPDATE cart SET select_qty = ${select_qty} WHERE user_id = ${user_id} and store_id = ${store_id} and md_id = ${md_id};`
      ,[select_qty, user_id, store_id, md_id]
    )
    resultCode = 200;
    message = "cart_update 성공";
    
    return res.json({
      code: resultCode,
      message: message,
      cart_update: cart_update
    }); 
  }
  catch (err) {
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

router.get("/cartChecked", async(req, res, next) => {
  let user_id = req.query.user_id;
  let row_num = req.query.row_num;
  try {
    const [cart_checked] = await pool.execute(
      `SELECT * FROM (SELECT @ROWNUM:=@ROWNUM+1 AS ROWNUM, user_id, cart.store_id, cart.md_id, stk_remain, select_qty, cart_pu_date, cart_pu_time, store_loc, store_name, pay_price, md_name, pay_comp, mdimg_thumbnail from (SELECT @ROWNUM := -1) R, ggdjang.cart join store on ggdjang.cart.store_id = store.store_id join payment on payment.md_id = ggdjang.cart.md_id join md on ggdjang.cart.md_id = md.md_id join md_Img on md.md_id=md_Img.md_id join stock on md.md_id=stock.md_id WHERE ggdjang.cart.user_id = ${user_id}) T WHERE ROWNUM=${row_num};`
      ,[user_id, row_num]
    )
    resultCode = 200;
    message = "cart_checked 성공";
    
    return res.json({
      code: resultCode,
      message: message,
      cart_checked: cart_checked
    }); 
  }
  catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
})

module.exports = router;
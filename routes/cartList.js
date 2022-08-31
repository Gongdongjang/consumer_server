const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/cartListView", async (req, res, next) => {
  const {user_id, md_id, store_id, pu_date, pu_time, purchase_num} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const [cart_list] = await pool.execute(
      `INSERT INTO cart (user_id, md_id, store_id, select_qty, cart_pu_date, cart_pu_time) VALUES (?, ?, ?, ?, ?, ?)`,
      (user_id, md_id, store_id, purchase_num, pu_date, pu_time)
    );
    resultCode = 200;
    message = "orderDetail 성공";

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

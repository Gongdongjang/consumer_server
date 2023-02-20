const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const user_id = req.body.user_id;
  const order_id = req.body.order_id;
  const rvw_rating = req.body.rvw_rating;
  const rvw_content = req.body.rvw_content;
  const rvw_img1 = req.body.rvw_img1;
  const rvw_img2 = req.body.rvw_img2;
  const rvw_img3 = req.body.rvw_img3;

  console.log(user_id + "\n");
  console.log(rvw_img1);

  try {
    const [review_detail] = await pool.execute(
      `SELECT md_id, store_id FROM order WHERE order_id = ${order_id}`
    );

    console.log(review_detail[0].md_id);
    const [user_no] = await pool.execute(
      `SELECT user_no FROM user WHERE user_id = ${user_id}`
    );

    const order_date = new Date();

    const [data] = await pool.execute(
      `INSERT INTO review (rvw_datetime, rvw_rating, rvw_content, order_id, md_id, store_id, user_no, rvw_img1, rvw_img2, rvw_img3, rvw_isDelete) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        order_date,
        rvw_rating,
        rvw_content,
        order_id,
        review_detail[0].md_id,
        review_detail[0].store_id,
        user_no[0].user_no,
        rvw_img1,
        rvw_img2,
        rvw_img3,
        0,
      ]
    );

    resultCode = 200;
    message = "review 등록 성공";

    return res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

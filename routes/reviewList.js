const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const user_id = req.body.user_id;

  try {
    const [user_no] = await pool.execute(
      `SELECT user_no FROM user WHERE user_id = ?`, [user_id]
    );

    //img 미리 한 번 보내고 detail에서 사용할 수 있도록 + isDelete가 0인 경우에만 보이게 수정
    const [data] = await pool.execute(
      `SELECT review.order_id, rvw_rating, rvw_content, rvw_img1, rvw_img2, rvw_img3, md_name, store_name, mdimg_thumbnail, order_select_qty, pay_price FROM review join md on md.md_id = review.md_id join store on store.store_id = review.store_id join md_Img on md_Img.md_id = review.md_id join ggdjang.order on ggdjang.order.order_id = review.order_id join payment on payment.md_id = review.md_id WHERE user_no = ${user_no[0].user_no} and rvw_isDelete = 0`
    );

    resultCode = 200;
    message = "리뷰 조회 성공";

    return res.json({
      code: resultCode,
      message: message,
      my_review_list: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

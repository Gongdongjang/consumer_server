const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/farmDetail", async (req, res, next) => {
  const {farm_id} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  try {
    const [farm_data] = await pool.execute(
      `SELECT * FROM farm WHERE farm_id = ? `,
      [farm_id]
    );

    const [md_data] = await pool.execute(
      `SELECT * FROM md join payment on md.md_id = payment.md_id join pickup on md.md_id = pickup.md_id join store on pickup.store_id = store.store_id join md_Img on md.md_id = md_Img.md_id join farm on md.farm_id = farm.farm_id where md.farm_id = ?`,
      [farm_id]
    );

    const [review_data] = await pool.execute(
      `SELECT review.order_id, order.user_name, order.user_id, rvw_rating, rvw_content, rvw_img1, rvw_img2, rvw_img3, md_name, store_name, mdimg_thumbnail, order_select_qty, pay_price FROM farm join md on farm.farm_id = md.farm_id join review on review.md_id = md.md_id join store on store.store_id = review.store_id join md_Img on md_Img.md_id = review.md_id join ggdjang.order on ggdjang.order.order_id = review.order_id join payment on payment.md_id = review.md_id WHERE farm.farm_id = ${farm_id}`
    );

    resultCode = 200;
    message = "성공";

    let pu_start = new Array();
    let pu_end = new Array();
    let dDay = new Array();
    let now = new Date();

    for (let i = 0; i < md_data.length; i++) {
      pu_start[i] = new Date(md_data[i].pu_start).toLocaleDateString();
      pu_end[i] = new Date(md_data[i].pu_end).toLocaleDateString();

      let distance = new Date(md_data[i].md_end.getTime() - now.getTime());
      dDay[i] = Math.floor(distance / (1000 * 60 * 60 * 24));
    }

    return res.json({
      code: resultCode,
      message: message,
      farm_data: farm_data,
      md_data: md_data,
      pu_start: pu_start,
      pu_end: pu_end,
      dDay: dDay,
      review_data: review_data,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

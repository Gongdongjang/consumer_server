const pool = require("../db");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");

//받은 md_id에 대한 상세 데이터 return
router.post("/jointPurchase", async (req, res, next) => {
  const {user_id, md_id} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //farmer_name 추가 필요
    //mdImg_thumbnail, mdImg_detail 맞는지 확인
    //모인인원 → 남은물품, 목표인원 → 목표 수량이 맞는지 확인
    //store_filesize, farm_size은 프로필 맞는지 확인

    //pay_price와 pay_comp 추가
    //store 위치정보 추가
    const [md_detail_result] = await pool.query(
      "select * from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join stock on md.md_id=stock.md_id join md_Img on md.md_id=md_Img.md_id where md.md_id = ?",
      md_id
    );

    const [review_data] = await pool.query(
      `SELECT review.order_id, rvw_rating, rvw_content, rvw_img1, rvw_img2, rvw_img3, md_name, store_name, mdimg_thumbnail, order_select_qty, pay_price, order.user_id, order.user_name FROM md join review on review.md_id = md.md_id join store on store.store_id = review.store_id join md_Img on md_Img.md_id = review.md_id join ggdjang.order on ggdjang.order.order_id = review.order_id join payment on payment.md_id = review.md_id WHERE md.md_id = ${md_id}`
    );

    resultCode = 200;
    message = "제품 상세로 정보보내기 성공";

    // let pay_schedule = new Date(md_detail_result[0].pay_schedule).toLocaleDateString();
    let pu_start = new Date(md_detail_result[0].pu_start).toLocaleDateString();
    let pu_end = new Date(md_detail_result[0].pu_end).toLocaleDateString();
    let md_end = new Date(md_detail_result[0].md_end).toLocaleDateString();

    let now = new Date();
    let distance =
      new Date(md_detail_result[0].md_end).getTime() - now.getTime();

    const dDay = Math.floor(distance / (1000 * 60 * 60 * 24));

    return res.json({
      code: resultCode,
      message: message,
      md_detail_result: md_detail_result,
      pu_start: pu_start,
      pu_end: pu_end,
      md_end: md_end,
      dDay: dDay,
      review_data: review_data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

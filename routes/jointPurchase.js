const pool = require("../db");
const express = require("express");
const router = express.Router();

//받은 md_id에 대한 상세 데이터 return
router.post("/jointPurchase", async (req, res, next) => {
  const {md_id} = req.body;
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
      'select mdimg_thumbnail, md_name, farm_name, stk_remain, stk_goal, pay_price, pay_comp, pu_start, pu_end, mdImg_detail, farm_info, store_filename, store.store_id, store_name, store_info, store_lat, store_long, store_loc from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join stock on md.md_id=stock.md_id join md_Img on md.md_id=md_Img.md_id where md.md_id = ?', md_id
    );

    resultCode = 200;
    message = "제품 상세로 정보보내기 성공";

    // let pay_schedule = new Date(md_detail_result[0].pay_schedule).toLocaleDateString();
    let pu_start = new Date(md_detail_result[0].pu_start).toLocaleDateString();
    let pu_end = new Date(md_detail_result[0].pu_end).toLocaleDateString();

    return res.json({
      code: resultCode,
      message: message,
      md_detail_result: md_detail_result,
      // pay_schedule:pay_schedule,
      pu_start:pu_start,
      pu_end:pu_end,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

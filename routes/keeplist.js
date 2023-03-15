const pool = require("../db");
const express = require("express");
const router = express.Router();

//받은 md_id에 대한 상세 데이터 return
router.post("/keeplist", async (req, res, next) => {
  const {user_id} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //farmer_name 추가 필요
    //mdImg_thumbnail, mdImg_detail 맞는지 확인
    //모인인원 → 남은물품, 목표인원 → 목표 수량이 맞는지 확인
    //store_filesize, farm_size은 프로필 맞는지 확인
    const [keep_list_result] = await pool.query(
      "select keep.md_id, md_name, pu_start, pu_end, farm_name, store_name, store_loc, mdimg_thumbnail, pay_price, md_end from keep join payment on keep.md_id=payment.md_id join pickup on keep.md_id=pickup.md_id join store on pickup.store_id=store.store_id join stock on keep.md_id=stock.md_id join md_Img on keep.md_id=md_Img.md_id join md on md.md_id = keep.md_id join farm on md.farm_id=farm.farm_id where keep.user_id = ?",
      user_id
    );

    resultCode = 200;
    message = "제품 리스트 정보보내기 성공";

    let count = await pool.query(
      "SELECT COUNT(*) FROM keep where user_id = ?",
      user_id
    );
    count = count[0][0]["COUNT(*)"];

    // let pay_schedule = new Array();
    let pu_start = new Array();
    let now = new Date();
    let dDay = new Array();

    // let pu_end = new Array();

    for (let i = 0; i < count; i++) {
      // pay_schedule[i] = new Date(keep_list_result[i].pay_schedule).toLocaleDateString();
      pu_start[i] = new Date(keep_list_result[i].pu_start).toLocaleDateString();
      let distance = new Date(keep_list_result[i].md_end.getTime() - now.getTime());
      dDay[i] = Math.floor(distance / (1000 * 60 * 60 * 24));
      //   pu_end[i] = new Date(keep_list_result[i].pu_end).toLocaleDateString();
    }

    return res.json({
      code: resultCode,
      message: message,
      keep_list_result: keep_list_result,
      // pay_schedule:pay_schedule,
      pu_start: pu_start,
      dDay: dDay,
      //   pu_end: pu_end,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

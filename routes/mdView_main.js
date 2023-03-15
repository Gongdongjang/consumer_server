const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //md, payment, pickup, store, farm
    //홈화면 제품리스트-> store_loc 추가
    //pu_end 삭제함
    //WHERE md_result is null or md_result=1 조건 추가함
    const [md_result] = await pool.execute(
      `select md_result, md.md_id, mdimg_thumbnail, md_name, pu_start, farm_name, store_name, md_end, pay_price, store_loc from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join md_Img on md.md_id = md_Img.md_id WHERE md_result is null or md_result=1 ORDER BY md.md_id desc`
    );

    let count = md_result.length;

    let pu_start = new Array();
    // let md_end = new Array();
    let dDay = new Array();
    let now = new Date();

    for (let i = 0; i < count; i++) {
      pu_start[i] = new Date(md_result[i].pu_start).toLocaleDateString();
      // md_end[i] = new Date(md_result[i].md_end).toLocaleDateString();
      let distance = new Date(md_result[i].md_end.getTime() - now.getTime());
      dDay[i] = Math.floor(distance / (1000 * 60 * 60 * 24));
    }

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      md_result: md_result,
      pu_start: pu_start,
      // md_end: md_end,
      dDay: dDay,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

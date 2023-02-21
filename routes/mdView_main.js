const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //md, payment, pickup, store, farm
    //홈화면 제품리스트-> store_loc 추가
    //pu_start, pu_end 삭제함,,
    //WHERE md_result is null or md_result=1 조건 추가함
    const [md_result] = await pool.execute(
      "select md_result, md.md_id, mdimg_thumbnail, md_name, farm_name, store_name, store_loc from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join md_Img on md.md_id = md_Img.md_id WHERE md_result is null or md_result=1 ORDER BY md.md_id desc"
    );

    //console.log(md_result);

    let count = await pool.query("SELECT COUNT(*) FROM md");
    count = count[0][0]["COUNT(*)"];

    // let pay_schedule = new Array();
    let pu_start = new Array();
    let pu_end = new Array();

    for (let i = 0; i < count; i++) {
      // pay_schedule[i] = new Date(
      //   md_result[i].pay_schedule
      // ).toLocaleDateString();
      //pu_start[i] = new Date(md_result[i].pu_start).toLocaleDateString();
      //pu_end[i] = new Date(md_result[i].pu_end).toLocaleDateString();
    }

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      md_result: md_result,
      // pay_schedule: pay_schedule,
      //pu_start: pu_start,
      //pu_end: pu_end,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

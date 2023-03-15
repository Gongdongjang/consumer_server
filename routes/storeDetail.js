const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/storeDetail", async (req, res, next) => {
  const store_id = parseInt(req.body.id);
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행

    let d = new Date();
    let weekday = new Array(7);
    weekday[0] = "일";
    weekday[1] = "월";
    weekday[2] = "화";
    weekday[3] = "수";
    weekday[4] = "목";
    weekday[5] = "금";
    weekday[6] = "토";

    let n = weekday[d.getDay()];

    //스토어 상세정보
    const [store_result] = await pool.execute(
      `SELECT * FROM store WHERE store_id= ${store_id}`
    );

    //스토어에 있는 제품리뷰
    const [review_result] = await pool.execute(
      `SELECT rvw_rating, rvw_content, md.md_id, md.md_name FROM review join md on review.md_id=md.md_id WHERE store_id=${store_id}`
    );

    //스토어 현재 진행중인 공동구매
    const [md_data] = await pool.execute(
      `SELECT * FROM md join payment on md.md_id = payment.md_id join pickup on md.md_id = pickup.md_id join md_Img on md.md_id = md_Img.md_id join store on pickup.store_id = store.store_id join farm on md.farm_id=farm.farm_id where pickup.store_id =${store_id}`
    );

    //스토어 운영 시간
    const [store_date] = await pool.execute(
      `SELECT * FROM Hours WHERE hours_partner = 1 and hours_partnerId = ${store_id}`
    );

    resultCode = 200;
    message = "스토어 상세로 정보보내기 성공";

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
      store_result: store_result,
      jp_result: md_data,
      pu_start: pu_start,
      pu_end: pu_end,
      review_result: review_result,
      store_date: store_date,
      dDay: dDay,
      day: n,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

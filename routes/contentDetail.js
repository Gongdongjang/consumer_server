const pool = require("../db");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");

router.post("/", async (req, res, next) => {
  const {content_md_id1, content_md_id2} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const [contentDetail] = await pool.query(
      "select mdimg_thumbnail, md.md_id, md_name, store_name, store_loc, md_end, pay_price from md join payment on md.md_id=payment.md_id join pickup on md.md_id = pickup.md_id join store on pickup.store_id=store.store_id join md_Img on md.md_id=md_Img.md_id where md.md_id = ? or md.md_id = ?",
      [content_md_id1, content_md_id2]
    );

    resultCode = 200;
    message = "콘텐츠 상세로 정보보내기 성공";

    let dDay = new Array();
    let now = new Date();

    for (let i = 0; i < contentDetail.length; i++) {
      let distance =
        new Date(contentDetail[i].md_end).getTime() - now.getTime();
      dDay[i] = Math.floor(distance / (1000 * 60 * 60 * 24));
    }

    return res.json({
      code: resultCode,
      message: message,
      contentDetail: contentDetail,
      dDay: dDay,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

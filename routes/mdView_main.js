const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdeView_main", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT md_name, farm_id FROM md");
    //가게 이름: id = 1인 가게만 일단 출력되도록
    var farm_name = await pool.query(
      "SELECT farm_name FROM farm WHERE farm_id = 1"
    ); //일단 1로 해두고 나중에 수정 예정
    farm_name = farm_name[0]; //각 farm name
    console.log(farm_name);
    //md 이름
    const md_name = data[0][0].md_name;

    const md = data[0];
    var count = await pool.query("SELECT COUNT(*) FROM md where farm_id = 1");
    console.log("19행");
    console.log(data[0]);
    count = count[0][0]["COUNT(*)"];
    console.log(count);
    md = data[0];

    return res.json({
      code: resultCode,
      message: message,
      farm_name: farm_name,
      md_name: md_name,
      //   far_mainItem: farm_mainItem,
      count: count,
      md: md,
      // data: data,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

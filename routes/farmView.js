const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/farmView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT * FROM farm");
    //농가 이름
    const farm_name = data[0][0].farm_name;
    //농가 특징
    const farm_info = data[0][0].farm_info;
    //농가에서 판매 중인 물품
    const farm_mainItem = data[0][0].farm_mainItem;
    // const farm = data[0];
    var count = await pool.query("SELECT COUNT(*) FROM farm");
    console.log("19행");
    console.log(data[0]);
    count = count[0][0]["COUNT(*)"];
    console.log(count);
    farm = data[0];

    return res.json({
      code: resultCode,
      message: message,
      farm_name: farm_name,
      farm_info: farm_info,
      farm_mainItem: farm_mainItem,
      count: count,
      farm: farm,
      // data: data,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

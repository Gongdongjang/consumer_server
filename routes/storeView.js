const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/storeView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT * FROM store");
    //가게 이름
    const store_name = data[0][0].store_name;
    //가게 특징
    const store_info = data[0][0].store_info;

    // const farm = data[0];
    var count = await pool.query("SELECT COUNT(*) FROM store");
    console.log("19행");
    console.log(data[0]);
    count = count[0][0]["COUNT(*)"];
    console.log(count);
    store = data[0];

    return res.json({
      code: resultCode,
      message: message,
      store_name: store_name,
      store_info: store_info,
      //   far_mainItem: farm_mainItem,
      count: count,
      store: store,
      // data: data,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

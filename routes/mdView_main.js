const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //md, payment, pickup, store, farm
    const [md_result] = await pool.execute(
      "select md.md_id, mdimg_thumbnail, md_name, pu_start, pu_end, farm_name, store_name, store_loc from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join md_Img on md.md_id = md_Img.md_id ORDER BY md.md_id desc"
    );

    let count = await pool.query("SELECT COUNT(*) FROM md");
    count = count[0][0]["COUNT(*)"];

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      md_result: md_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

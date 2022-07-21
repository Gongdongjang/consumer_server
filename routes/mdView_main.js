const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {

    const [result] = await pool.execute("select md_name, pu_start, pu_end, pay_schedule, farm_name, store_name from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id ORDER BY md.md_id desc");

    console.log(result);

    return res.json({
        result:result,
        // count: count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

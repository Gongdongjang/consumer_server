const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/farmDetail", async (req, res, next) => {
  const {farm_id} = req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    const [md_data] = await pool.execute(
      `SELECT * FROM md join payment on md.md_id = payment.md_id join pickup on md.md_id = pickup.md_id join store on pickup.store_id = store.store_id where md.farm_id = ?`,
      [farm_id]
    );
    resultCode = 200;
    message = "성공";

    let pu_start = new Array();
    let pu_end = new Array();
    let pay_schedule = new Array();

    for (let i = 0; i < md_data.length; i++) {
      pu_start[i] = new Date(md_data[0].pu_start).toLocaleDateString();
      pu_end[i] = new Date(md_data[0].pu_end).toLocaleDateString();
      pay_schedule[i] = new Date(md_data[0].pay_schedule).toLocaleDateString();
    }

    return res.json({
      code: resultCode,
      message: message,
      md_data: md_data,
      pay_schedule: pay_schedule,
      pu_start: pu_start,
      pu_end: pu_end,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/farmDetail", async (req, res, next) => {
  const {farm_id} = req.body;
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  try {
    const [farm_data] = await pool.execute(
      `SELECT * FROM farm WHERE farm_id = ? `,
      [farm_id]
    );

    const [md_data] = await pool.execute(
      `SELECT * FROM md join payment on md.md_id = payment.md_id join pickup on md.md_id = pickup.md_id join store on pickup.store_id = store.store_id join md_Img on md.md_id = md_Img.md_id join farm on md.farm_id = farm.farm_id where md.farm_id = ?`,
      [farm_id]
    );
    resultCode = 200;
    message = "성공";

    let pu_start = new Array();
    let pu_end = new Array();
    let dDay = new Array();
    let now = new Date();

    for (let i = 0; i < md_data.length; i++) {
      pu_start[i] = new Date(md_data[i].pu_start).toLocaleDateString();
      pu_end[i] = new Date(md_data[i].pu_end).toLocaleDateString();

      let distance = md_data[i].md_end.getTime() - now.getTime();
      dDay[i] = Math.floor(distance / (1000 * 60 * 60 * 24));
    }

    return res.json({
      code: resultCode,
      message: message,
      farm_data: farm_data,
      md_data: md_data,
      pu_start: pu_start,
      pu_end: pu_end,
      dDay: dDay,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/farmDetail", async (req, res, next) => {
  const {farm_id, md_count} = req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    const data = await pool.query(`SELECT * FROM md where farm_id = ?`, [
      farm_id,
    ]);
    resultCode = 200;
    message = "성공";
    let md_name = new Array();
    let md_id = new Array();
    let pu_start = new Array();
    let pu_end = new Array();
    let store_id = new Array();
    let store_name = new Array();
    let pay_schedule = new Array();

    for (let i = 0; i < md_count; i++) {
      const data2 = await pool.query(
        `SELECT pu_start, pu_end, store_id, pay_schedule FROM pickup, payment where pickup.md_id = ?`,
        [data[0][i].md_id]
      );
      md_id[i] = data[0][i].md_id;
      md_name[i] = data[0][i].md_name;
      pu_start[i] = new Date(data2[0][0].pu_start).toLocaleDateString();
      pu_end[i] = new Date(data2[0][0].pu_end).toLocaleDateString();
      store_id[i] = data2[0][0].store_id;
      pay_schedule[i] = new Date(data2[0][0].pay_schedule).toLocaleDateString();
    }

    for (let i = 0; i < md_count; i++) {
      const data3 = await pool.query(
        `SELECT store_name FROM store where store_id =?`,
        [store_id[i]]
      );
      store_name[i] = data3[0][0].store_name;
    }

    return res.json({
      code: resultCode,
      message: message,
      md_name: md_name,
      pu_start: pu_start,
      pu_end: pu_end,
      store_name: store_name,
      pay_schedule: pay_schedule,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

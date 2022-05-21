const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query(
      "SELECT pu_start, pu_end, md_id, store_id FROM pickup"
    );

    let pu_start = new Array();
    let pu_end = new Array();
    let store_name = new Array();
    let md_name = new Array();
    let pay_schedule = new Array();
    let farm_id = new Array();
    let farm_name = new Array();
    // console.log("22");

    let count = await pool.query("SELECT COUNT(*) FROM md"); //md나 pickup이나 행 개수가 같아야 되는 것 같음
    count = count[0][0]["COUNT(*)"];

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      let st_name = await pool.query(
        "SELECT store_name FROM store WHERE store_id = ?",
        [data[0][i].store_id]
      );
      pu_start[i] = new Date(data[0][i].pu_start).toLocaleDateString();
      pu_end[i] = new Date(data[0][i].pu_end).toLocaleDateString();
      store_name[i] = st_name[0][0].store_name;
      connection.release();
    }

    // console.log("39");

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      md_n = await pool.query(
        "SELECT md_name, farm_id, pay_schedule FROM md, payment WHERE md.md_id = ?",
        [data[0][i].md_id]
      );
      md_name[i] = md_n[0][0].md_name;
      pay_schedule[i] = new Date(md_n[0][i].pay_schedule).toLocaleDateString();
      farm_id[i] = md_n[0][0].farm_id;
      connection.release();
    }

    // console.log("53");

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      // console.log(farm_id);

      let frm_name = await pool.query(
        `SELECT farm_name FROM farm where farm_id = ?`,
        [farm_id[i]]
      );
      // console.log(farm_id);
      farm_name[i] = frm_name[0][0].farm_name;
      connection.release();
    }
    // console.log(st_name);
    // console.log(count);

    return res.json({
      code: resultCode,
      message: message,
      store_name: store_name,
      md_name: md_name,
      count: count,
      pu_start: pu_start,
      pu_end: pu_end,
      pay_schedule: pay_schedule,
      farm_name: farm_name,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

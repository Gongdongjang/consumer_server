const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/storeView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT md_id, store_id FROM pickup");
    let st_arr = new Array();
    let md_arr = new Array();
    var count = await pool.query("SELECT COUNT(*) FROM pickup");
    count = count[0][0]["COUNT(*)"];
    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      store_name = await pool.query(
        "SELECT store_name FROM store where store_id = ?",
        [data[0][i].store_id]
      );
      st_arr[i] = store_name[0][0].store_name;
      connection.release();
    }
    // console.log(st_arr);
    // let jsonSt_name = JSON.stringify(st_obj);
    // console.log(jsonSt_name);

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      md_name = await pool.query("SELECT md_name FROM md where md_id = ?", [
        data[0][i].md_id,
      ]);
      md_arr[i] = md_name[0][0].md_name;
      connection.release();
    }
    // console.log(md_arr);

    // store = data[0];

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      // store: store,
      md_obj: md_obj,
      st_obj: st_obj,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

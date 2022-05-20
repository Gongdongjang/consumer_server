const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mdView_main", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT md_id, store_id FROM pickup");

    let st_name = new Array();
    let md_name = new Array();

    let count = await pool.query("SELECT COUNT(*) FROM pickup");
    count = count[0][0]["COUNT(*)"];

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      store_name = await pool.query(
        "SELECT store_name FROM store WHERE store_id = ?",
        [data[0][i].store_id]
      );
      st_name[i] = store_name[0][0].store_name;
      connection.release();
    }

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      md_n = await pool.query("SELECT md_name FROM md WHERE md_id = ?", [
        data[0][i].md_id,
      ]);
      md_name[i] = md_n[0][0].md_name;
      connection.release();
    }

    // console.log(st_name);
    // console.log(md_name);

    return res.json({
      code: resultCode,
      message: message,
      st_name: st_name,
      md_name: md_name,
      count: count,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

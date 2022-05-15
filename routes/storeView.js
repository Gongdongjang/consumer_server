const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/storeView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query(
      "SELECT pu_start, pu_end, md_id, store_id FROM pickup"
    );

    let st_arr = new Array();
    let md_arr = new Array();
    let pu_start = new Array();
    let pu_end = new Array();
    //let store = new Array();

    //세부페이지에 쓰일 store테이블 속성들
    let store_info = new Array();
    let store_hours = new Array();
    let store_restDays = new Array();
    let store_loc = new Array();
    let store_lat = new Array();
    let store_long= new Array();

    let count = await pool.query("SELECT COUNT(*) FROM pickup");
    count = count[0][0]["COUNT(*)"];
    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      store_name = await pool.query(
        "SELECT store_name,store_info,store_hours,store_restDays,store_loc,store_lat,store_long FROM store where store_id = ?",
        [data[0][i].store_id]
      );
      st_arr[i] = store_name[0][0].store_name;
      //세부
      store_info[i]=store_name[0][0].store_info;
      store_hours[i]=store_name[0][0].store_hours;
      store_restDays[i]=store_name[0][0].store_restDays;
      store_loc[i]=store_name[0][0].store_loc;
      store_lat[i]=store_name[0][0].store_lat;
      store_long[i]=store_name[0][0].store_long;
      
      connection.release();
    }

    for (let i = 0; i < count; i++) {
      let connection = await pool.getConnection(async (conn) => conn);
      md_name = await pool.query(
        "SELECT md_name, md_start, md_end FROM md where md_id = ?",
        [data[0][i].md_id]
      );
      md_arr[i] = md_name[0][0].md_name;
      pu_start[i] = new Date(md_name[0][0].md_start).toLocaleDateString();
      pu_end[i] = new Date(md_name[0][0].md_end).toLocaleDateString();
      connection.release();
    }

    console.log("66행");
    console.log(store_info);
    console.log(store_hours);
    console.log(store_restDays);
    console.log(store_loc);


    return res.json({
      code: resultCode,
      message: message,
      count: count,
      //store_count: store_count,
      md_arr: md_arr,
      st_arr: st_arr,
      pu_start: pu_start,
      pu_end: pu_end,
      // 세부
      store_info:store_info,
      store_hours:store_hours,
      store_restDays: store_restDays,
      store_loc: store_loc,
      store_lat: store_lat,
      store_long: store_long,

    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

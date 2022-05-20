const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/farmView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  // console.log("9행 farmView다!!!");

  try {
    //문제 없으면 try문 실행

    // console.log("farmView다!!!");

    let farm_id = new Array();
    let farm_arr = new Array();
    let farm_mainItem = new Array();
    let farm_info = new Array();
    let farm_loc = new Array();
    let farm_lat = new Array();
    let farm_long = new Array();
    let farm_hours = new Array();
    //추가
    let md_name = new Array();
    let md_count = new Array();
    let md_id = new Array();
    let pu_start = new Array();
    let pu_end = new Array();
    let store_id = new Array();
    let store_name = new Array();

    let count = await pool.query("SELECT COUNT(*) FROM farm");
    count = count[0][0]["COUNT(*)"];
    // console.log("farm의 count개수: " + count);

    for (let i = 0; i < count; i++) {
      //재할당이니까 const가 아닌 let이다..!!
      // console.log(i);
      let data = await pool.query("SELECT * FROM farm");

      md_name[i] = new Array();
      md_id[i] = new Array();
      pu_start[i] = new Array();
      pu_end[i] = new Array();
      store_id[i] = new Array();
      store_name[i] = new Array();

      //console.log("data[0][i] 번째");

      farm_id[i] = data[0][i].farm_id;
      farm_arr[i] = data[0][i].farm_name;
      farm_mainItem[i] = data[0][i].farm_mainItem;
      farm_info[i] = data[0][i].farm_info;
      farm_loc[i] = data[0][i].farm_loc;
      farm_lat[i] = data[0][i].farm_lat;
      farm_long[i] = data[0][i].farm_long;
      farm_hours[i] = data[0][i].farm_hours;
    }

    for (let i = 1; i <= count; i++) {
      let md_count_on = await pool.query(
        `SELECT count(*) FROM md where farm_id = ?`,
        [i]
      );

      md_count[i - 1] = md_count_on[0][0]["count(*)"];

      let md = await pool.query(
        `SELECT md_id, md_name FROM md where farm_id = ?`,
        [i]
      );

      for (let j = 0; j < md_count[i - 1]; j++) {
        md_name[i - 1][j] = md[0][j].md_name;
        md_id[i - 1][j] = md[0][j].md_id;
      }
    }

    // console.log("farm_details 정보들");
    // console.log(farm_arr);
    // console.log(farm_mainItem);
    // console.log(farm_info);
    // console.log(farm_loc);
    // console.log(farm_lat);
    // console.log(farm_long);
    // console.log(farm_hours);
    // //상세 페이지
    // console.log(md_name);
    // console.log(md_count);
    // console.log(md_id);
    // console.log(pu_start);
    // console.log(pu_end);
    // console.log(store_name);
    //농가명은 본인 페이지꺼 가져다가 띄우기

    return res.json({
      code: resultCode,
      message: message,
      count: count,
      farm_id: farm_id,
      farm_arr: farm_arr,
      farm_mainItem: farm_mainItem,
      farm_info: farm_info,
      farm_loc: farm_loc,
      farm_lat: farm_lat,
      farm_long: farm_long,
      farm_hours: farm_hours,
      //상세 페이지 띄우기 위한 변수
      md_name: md_name,
      md_count: md_count,
      // store_name: store_name,
      // pu_start: pu_start,
      // pu_end: pu_end,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

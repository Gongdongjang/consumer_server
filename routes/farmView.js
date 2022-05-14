const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/farmView", async (req, res, next) => {
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  console.log("9행 farmView다!!!");

  try {
    //문제 없으면 try문 실행

    console.log("farmView다!!!");

    let farm_arr = new Array();
    let farm_mainItem = new Array();
    let farm_info = new Array();
    let farm_loc = new Array();
    let farm_lat=new Array();
    let farm_long=new Array();
    let farm_hours=new Array();

    let count = await pool.query("SELECT COUNT(*) FROM farm");
    count = count[0][0]["COUNT(*)"];
    console.log("farm의 count개수: "+ count);

    for (let i=0; i< count; i++) { //재할당이니까 const가 아닌 let이다..!!
      console.log(i);
      let data = await pool.query("SELECT farm_name, farm_info, farm_mainItem, farm_loc, farm_lat, farm_long, farm_hours FROM farm");
  
      //console.log("data[0][i] 번째");

      farm_arr[i]=data[0][i].farm_name;
      farm_mainItem[i]=data[0][i].farm_mainItem;
      farm_info[i]=data[0][i].farm_info;
      farm_loc[i]=data[0][i].farm_loc;
      farm_lat[i]=data[0][i].farm_lat;
      farm_long[i]=data[0][i].farm_long;
      farm_hours[i]=data[0][i].farm_hours;
    }

    console.log("farm_details 정보들");
    console.log(farm_arr);
    console.log(farm_mainItem);
    console.log(farm_info);
    console.log(farm_loc);
    console.log(farm_lat);
    console.log(farm_long);
    console.log(farm_hours);


    return res.json({
      code: resultCode,
      message: message,
      count: count,
      farm_arr: farm_arr,
      farm_mainItem: farm_mainItem,
      farm_info: farm_info,
      farm_loc: farm_loc,
      farm_lat: farm_lat,
      farm_long: farm_long,
      farm_hours: farm_hours,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

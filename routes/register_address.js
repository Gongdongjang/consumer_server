const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const addresslist=req.body.address.substring(1, req.body.address.length - 1); // [ ] 제거

  let address=addresslist.split(', ')
  const count=address.length;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let userno;

  const sql1="INSERT INTO address_user (userno, loc1) VALUES (?,?)" ;
  const sql2="INSERT INTO address_user (userno, loc1, loc2) VALUES (?, ?, ?)" ;
  const sql3="INSERT INTO address_user (userno, loc1, loc2, loc3) VALUES (?, ?, ?, ?)" ;

  try {
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;
    //console.log(userno);

    const param1=[userno,address[0],address[1]];
    const param2=[userno,address[0],address[1],address[2]];
    const param3=[userno,address[0],address[1],address[2],address[3]];
  
    let sql;
    let param;
  
    //주소 사이즈
    if(count==1){ sql=sql1; param=param1; }
    else if(count==2){ sql=sql2; param=param2; }
    else if(count==3){ sql=sql3; param=param3; }
    
    const data = await pool.query(sql, param);
    resultCode = 200;
    message = "주소저장에 성공했습니다!";

    return res.json({
      code: resultCode,
      message: message,
      userno: userno
    });
  } catch (err) {
    //에러 처리
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

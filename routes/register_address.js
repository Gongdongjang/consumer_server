const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const addresslist=req.body.address.substring(1, req.body.address.length - 1); // [ ] 제거
  const first_time=req.body.first_time;

  let address=addresslist.split(', ')
  const count=address.length;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let userno;

  let sql1, sql2, sql3;
  //first_time 이 yes이면 insert문
  if(first_time == "yes"){
    sql1="INSERT INTO address_user (userno, loc1, standard_address) VALUES (?,?,?)" ;
    sql2="INSERT INTO address_user (userno, loc1, loc2, standard_address) VALUES (?, ?, ?, ?)" ;
    sql3="INSERT INTO address_user (userno, loc1, loc2, loc3, standard_address) VALUES (?, ?, ?, ?, ?)" ;
  } else{   //first_time이 no면 update문
    sql1=`UPDATE address_user SET loc1 = ? , standard_address = ? WHERE userno = ?` ;
    sql2=`UPDATE address_user SET loc1 = ? , loc2 = ? , standard_address = ? WHERE userno = ?` ;
    sql3=`UPDATE address_user SET loc1 = ? , loc2 = ? , loc3 = ? ,standard_address = ? WHERE userno = ?` ;
  }

  try {
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;
    //console.log(userno);

    let param1, param2, param3;
    if(first_time == "yes"){
      param1=[userno,address[0],address[0]];
      param2=[userno,address[0],address[1],address[0]];
      param3=[userno,address[0],address[1],address[2],address[0]];
    } else{   //first_time이 no //근데 현재위치를 기준주소로 설정하면 어떻게 할까..?
      param1=[address[0],address[0],userno];
      param2=[address[0],address[1],address[0],userno];
      param3=[address[0],address[1],address[2],address[0],userno];
    }

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

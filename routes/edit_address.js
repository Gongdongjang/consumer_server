const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let count=3;
  let {userid, currentAddr, loc1, loc2, loc3} = req.body;
  currentAddr=currentAddr.substring(0,currentAddr.length - 1); // [ ] 제거

  if(loc3=="+") count--;
  if(loc2=="+") count--;
  if(loc1=="+") count--;

    let sql0, sql1, sql2, sql3;
    //first_time이 no면 update문
    sql0=`UPDATE address_user SET loc0 = ?, standard_address = ? WHERE userno = ?` ;
    sql1=`UPDATE address_user SET loc0 = ?, loc1 = ? , standard_address = ? WHERE userno = ?` ;
    sql2=`UPDATE address_user SET loc0 = ?, loc1 = ? , loc2 = ? , standard_address = ? WHERE userno = ?` ;
    sql3=`UPDATE address_user SET loc0 = ?, loc1 = ? , loc2 = ? , loc3 = ? ,standard_address = ? WHERE userno = ?` ;
  
  try {
    let userno
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;

    let param0, param1, param2, param3;

    //주소 수정 시 현재위치가 기준 주소지로 변경된다.
    param0=[currentAddr, currentAddr, userno];
    param1=[currentAddr, loc1, currentAddr, userno];
    param2=[currentAddr, loc1, loc2, currentAddr, userno];
    param3=[currentAddr, loc1, loc2, loc3, currentAddr, userno];

    let sql;
    let param;
  
    //주소 사이즈
    if (count==0){sql=sql0; param=param0;}
    else if(count==1){ sql=sql1; param=param1; }
    else if(count==2){ sql=sql2; param=param2; }
    else if(count==3){ sql=sql3; param=param3; }
    
    const data = await pool.query(sql, param);
    resultCode = 200;
    message = "주소수정에 성공했습니다!";

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

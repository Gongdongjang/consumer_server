const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const addresslist=req.body.address.substring(1, req.body.address.length - 1); // [ ] 제거
  const first_time=req.body.first_time;
  const currentAddr=req.body.currentAddr;

  let address=addresslist.split(', ')
  let count=address.length;

  //주소 수정안하고 주소저장했을때
  if (address==''){
    console.log("값수정x:", count);
    count=0;
  }

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  let sql0, sql1, sql2, sql3;
  //first_time 이 yes이면 insert문
  if(first_time == "yes"){
    sql0="INSERT INTO address_user (userno, loc0, standard_address) VALUES (?,?,?)" ;
    sql1="INSERT INTO address_user (userno, loc0, loc1, standard_address) VALUES (?,?,?,?)" ;
    sql2="INSERT INTO address_user (userno, loc0, loc1, loc2, standard_address) VALUES (?, ?, ?, ?, ?)" ;
    sql3="INSERT INTO address_user (userno, loc0, loc1, loc2, loc3, standard_address) VALUES (?, ?, ?, ?, ?, ?)" ;
  } else{   //first_time이 no면 update문
    sql0=`UPDATE address_user SET loc0 = ?, standard_address = ? WHERE userno = ?` ;
    sql1=`UPDATE address_user SET loc0 = ?, loc1 = ? , standard_address = ? WHERE userno = ?` ;
    sql2=`UPDATE address_user SET loc0 = ?, loc1 = ? , loc2 = ? , standard_address = ? WHERE userno = ?` ;
    sql3=`UPDATE address_user SET loc0 = ?, loc1 = ? , loc2 = ? , loc3 = ? ,standard_address = ? WHERE userno = ?` ;
  }

  try {
    let userno, std_address;
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;

    let param0, param1, param2, param3;
    if(first_time == "yes"){
      param0=[userno,currentAddr,currentAddr];
      param1=[userno,currentAddr,address[0],currentAddr];
      param2=[userno,currentAddr,address[0],address[1],currentAddr];
      param3=[userno,currentAddr,address[0],address[1],address[2],currentAddr];
    
      //최초 로그인 했을 시 first_login 값 1로 바꿔주기
      const first_time = await pool.query(`UPDATE user SET first_login = 1 WHERE user_no = ?`, [userno]);

    } else{   //first_time이 no //근데 현재위치를 기준주소로 설정하면 어떻게 할까..?
      //주소변경했을 때 DB에 있는 standard_address 값 가져와서 넣어줘야함. 안그러면 수정 전 버전이 standard_address에 설정되어있을수도...
      const a_data = await pool.query("SELECT standard_address FROM address_user WHERE userno=? ", [userno]);
      std_address=a_data[0][0].standard_address;

      param0=[currentAddr,currentAddr,userno];
      param1=[currentAddr, address[0],address[0],userno];
      //param1=[address[0],std_address,userno];
      param2=[currentAddr, address[0],address[1],address[0],userno];
      param3=[currentAddr, address[0],address[1],address[2],address[0],userno];
    }

    let sql;
    let param;
  
    //주소 사이즈
    if (count==0){sql=sql0; param=param0;}
    else if(count==1){ sql=sql1; param=param1; }
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

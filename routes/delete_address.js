const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const number=req.body.number;
  
  console.log("주소삭제 넘버:", number);

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  let sql;
  let sql1=`UPDATE address_user SET loc1= null WHERE userno = ?` ;
  let sql2=`UPDATE address_user SET loc2= null WHERE userno = ?` ;
  let sql3=`UPDATE address_user SET loc3= null WHERE userno = ?` ;

  if(number=="1") sql= sql1;
  else if (number=="2") sql= sql2;
  else sql= sql3;

  try {
    let userno, std_address;
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;

    const data = await pool.query(sql, [userno]);
    resultCode = 200;
    message = "주소삭제완료";

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
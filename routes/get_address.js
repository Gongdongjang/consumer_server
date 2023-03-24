const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const userid = req.body.id;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let first_time = "yes";

  try {
    const u_data = await pool.query(
      "SELECT user_no FROM user WHERE user_id=? ",
      [userid]
    );
    userno = u_data[0][0].user_no;

    //문제 없으면 try문 실행
    const [address_result] = await pool.execute(
      `SELECT loc0, loc1, loc2, loc3, standard_address FROM address_user WHERE userno=${userno}`
    );

    //console.log(address_result);
    if(address_result[0]==undefined)//처음 회원가입
      first_time="yes" 
    else first_time="no"

    let address_count = 3;

    if (address_result[0].loc3 == null) {
      address_count--; //address_count=2
    }
    if (address_result[0].loc2 == null) {
      address_count--; //address_count=1
    }
    if (address_result[0].loc1 == null) {
      address_count--; //address_count==0
    }
    console.log(address_count);
    resultCode = 200;
    message = "주소정보 얻기 성공";
    
    return res.json({
      code: resultCode,
      message: message,
      address_result: address_result,
      address_count: address_count,
      first_time: first_time
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
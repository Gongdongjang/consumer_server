const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;

    //문제 없으면 try문 실행
    const [address_result] = await pool.execute(
      `SELECT loc1, loc2, loc3 FROM address_user WHERE userno=${userno}`
    );

    let address_count=3;

    if(address_result.loc3 == null ){
        address_count--;    //address_count=2
    } else if (address_result.loc2==null){
        address_count--;    //address_count=1
    } else if (address_result.loc1==null){
        address_count--;    //address_count==0
    }

    //console.log(address_count);

    resultCode = 200;
    message = "주소정보 얻기 성공";

    return res.json({
      code: resultCode,
      message: message,
      address_result: address_result,
      address_count: address_count
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
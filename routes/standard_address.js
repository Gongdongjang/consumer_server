const pool = require("../db");
const express = require("express");
const router = express.Router();

//기준동네 등록하기
router.post("/register", async (req, res, next) => {
  const userid = req.body.id;
  const standard_address = req.body.standard_address;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let userno;

  try {
    const u_data = await pool.query(
      "SELECT user_no FROM user WHERE user_id=? ",
      [userid]
    );
    userno = u_data[0][0].user_no;

    const sql = "UPDATE address_user SET standard_address= ? WHERE userno=? ";
    const param = [standard_address, userno];

    const data = await pool.query(sql, param);
    resultCode = 200;
    message = "기준 주소 저장에 성공했습니다!";

    return res.json({
      code: resultCode,
      message: message,
      //userno: userno
    });
  } catch (err) {
    //에러 처리
    console.error(err);
    return res.status(500).json(err);
  }
});

//
//기준동네 정보 넘기기
router.post("/getStdAddress", async (req, res, next) => {
  const userid = req.body.id;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const u_data = await pool.query(
      "SELECT user_no FROM user WHERE user_id=? ",
      [userid]
    );
    userno = u_data[0][0].user_no;

    //문제 없으면 try문 실행
    const [std_address_result] = await pool.execute(
      `SELECT standard_address FROM address_user WHERE userno=${userno}`
    );

    // console.log(std_address_result);

    resultCode = 200;
    message = "기준 주소 정보 얻기 성공";

    return res.json({
      code: resultCode,
      message: message,
      std_address_result: std_address_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

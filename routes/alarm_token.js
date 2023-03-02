const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const token=req.body.token;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let userno;

  const sql="UPDATE user SET fcm_token = ? WHERE user_no = ?";

  try {
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
    userno=u_data[0][0].user_no;

    const param=[token,userno];
    
    const data = await pool.query(sql, param);
    resultCode = 200;
    message = "알림설정에 성공했습니다!";

    return res.json({
      code: resultCode,
      message: message,
    });
  } catch (err) {
    //에러 처리
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

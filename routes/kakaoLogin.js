const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/kakaoLogin", async (req, res, next) => {
  const {id, username, sns_type, refresh_token} =
    req.body;
  sql =
    "INSERT INTO user (user_id, user_name, sns_type, refresh_token) VALUES (?, ?, ?, ?)";
    const param = [id, username, sns_type, refresh_token];

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    let data = await pool.query("SELECT * FROM user WHERE user_id = ?", [id]);
    if (data[0][0] == undefined) {
      data = await pool.query(sql, param);
      resultCode = 200;
      message = "카카오 계정 회원가입 성공!";
    } else {
      resultCode = 200;
      message = data[0][0].user_name + "님 환영합니다!";
    }
    res.json({
      code: resultCode,
      message: message,
      id: id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

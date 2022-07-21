const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/kakaoLogin", async (req, res, next) => {
  const {id, username, nickname, sns_type, refresh_token, gender} =
    req.body;
  const sql =
    "INSERT INTO user (user_id, user_name, nickname, sns_type, refresh_token, gender) VALUES (?, ?, ?, ?, ?, ?)";
    const param = [id, username, nickname, sns_type, refresh_token, gender];

  //console.log(req.body);
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const data = await pool.query("SELECT * FROM user WHERE user_id = ?", [id]);

    if (data[0][0] == undefined) {
      data = await pool.query(sql, param);
      resultCode = 200;
      message = "카카오 계정 회원가입 성공!";
    } else {
      console.log("카카오 로그인 성공");
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

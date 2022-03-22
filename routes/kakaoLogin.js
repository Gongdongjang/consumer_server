const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/kakaoLogin", async (req, res, next) => {
  console.log("카카오 로그인 " + req.body.user_id);
  const {user_id, user_name, nickname, sns_type, refresh_token, gender} =
    req.body;
  var sql =
    "INSERT INTO user (user_id, user_name, nickname, sns_type, refresh_token, gender) VALUES (?, ?, ?, ?, ?, ?)";
  var param = [user_id, user_name, nickname, sns_type, refresh_token, gender];

  console.log(req.body);
  var resultCode = 404;
  var message = "에러가 발생했습니다.";

  try {
    var data = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      user_id,
    ]);

    if (data[0][0] == undefined) {
      console.log("23행- data[0][0] undefined");
      data = await pool.query(sql, param);
      //console.log("28행", data[0][0].user_name);
      resultCode = 200;
      message = "카카오 계정 회원가입 성공! ";
    } else {
      //console.log("33행 여긴login_result"+data);
      resultCode = 200;
      message = data[0][0].user_name + "님 환영합니다!";
    }
    res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  } catch (err) {
    console.log("catch-error부분");
    return res.status(500).json(err);
  }
});

module.exports = router;

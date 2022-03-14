const db = require("../db.js");
const express = require("express");
const router = express.Router();

router.post("/kakaoLogin", function (req, res) {
  console.log("카카오 로그인 " + req.body.user_id);
  //console.log("카카오 로그인 " + req.body.sns_type);
  var user_id = req.body.user_id;
  var user_name = req.body.user_name;
  var nickname = req.body.nickname;
  var sns_type=req.body.sns_type;
  var refresh_token=req.body.refresh_token;
  var gender= req.body.gender;

  var sql = "INSERT INTO user (user_id, user_name, nickname, sns_type, refresh_token, gender) VALUES (?, ?, ?, ?, ?, ?)";
  var param=[user_id, user_name, nickname,sns_type,refresh_token, gender];

  db.query(
    "SELECT * FROM user WHERE user_id = ?", [user_id], function (err, result) {
      var resultCode = 404;
      var message = "에러가 발생했습니다";
      console.log(result);

      if (result == null) {
        db.query(sql, param, function (error, output) {
          if (error) {
            console.error(error);
          } else {
            resultCode = 200;
            message =
            "카카오 계정 회원가입 성공! " +
            result[0].user_name +
            "님 환영합니다!";
          }
        });
      } else {
        //console.log("여긴login_result"+result);
        resultCode = 200;
        message = result[0].user_name + "님 환영합니다!";
      }

      res.json({
        code: resultCode,
        message: message,
        user_id: user_id,
      });
    }
  );
});

module.exports = router;


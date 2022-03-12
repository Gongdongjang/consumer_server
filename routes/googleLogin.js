const db = require("../db.js");
const express = require("express");
const router = express.Router();

router.post("/googleLogin", function (req, res) {
  console.log("구글 로그인 " + req.body.user_id);
  var user_id = req.body.user_id;
  var name = req.body.name;
  var nickname = req.body.nickname;
  var sns_type = "google";

  var sql = "INSERT INTO user (user_id, user_name, nickname, sns_type) VALUES (?, ?, ?, ?)";

  db.query(
    "SELECT * FROM user WHERE user_id = ?",
    [user_id],
    function (err, result) {
      var resultCode = 404;
      var message = "에러가 발생했습니다";
      console.log(result);

      if (result == null) {
        db.query(sql, [user_id, name, nickname, sns_type], function (error, output) {
          if (error) {
            console.error(error);
          } else {
            resultCode = 200;
            message =
              "구글 계정 회원가입 성공! " +
              result[0].user_name +
              "님 환영합니다!";
          }
        });
      } else {
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

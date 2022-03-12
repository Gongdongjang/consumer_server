const db = require("../db.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", function (req, res) {
  console.log(req.body);
  var user_id = req.body.user_id;
  var password = req.body.password;
  var sql = "SELECT * FROM user WHERE user_id = ?";

  db.query(sql, user_id, function (err, result) {
    var resultCode = 404;
    var message = "에러가 발생했습니다";

    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        resultCode = 206;
        message = "존재하지 않는 계정입니다!";
      } else if (!bcrypt.compareSync(password, result[0].password)) {
        resultCode = 204;
        message = "비밀번호가 틀렸습니다!";
      } else {
        resultCode = 200;
        message = "로그인 성공! " + result[0].user_name + "님 환영합니다!";
      }
    }

    res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  });
});

module.exports = router;

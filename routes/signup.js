const db = require("../db.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signup", function (req, res) {
  // console.log(req.body);
  var user_id = req.body.user_id;
  var password = req.body.password;
  var user_name = req.body.user_name;
  var nickname = user_id;
  var mobile_no = req.body.mobile_no;
  var gender = req.body.gender;
  password = bcrypt.hashSync(password, 10); // sync

  // 삽입을 수행하는 sql문.
  var sql =
    "INSERT INTO user (user_id, password, user_name, nickname, mobile_no, gender) VALUES (?, ?, ?, ?, ?, ?)";
  var params = [user_id, password, user_name, nickname, mobile_no, gender];

  // sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
  db.query(sql, params, function (err, result) {
    var resultCode = 404;
    var message = "에러가 발생했습니다";

    if (err) {
      console.log(err);
    } else {
      resultCode = 200;
      message = "회원가입에 성공했습니다.";
    }

    res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  });
});

module.exports = router;

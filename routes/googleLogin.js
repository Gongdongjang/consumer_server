const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/googleLogin", async (req, res, next) => {
  console.log("구글 로그인");
  const {user_id, name, nickname} = req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다";
  const sns_type = "google";

  try {
    var data = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      user_id,
    ]);
    if (data[0][0] == undefined) {
      //계정이 없다면
      console.log("18행");
      data = await pool.query(
        "INSERT INTO user (user_id, user_name, nickname, sns_type) VALUES (?, ?, ?, ?)",
        [user_id, name, nickname, sns_type]
      );
      console.log("23행");
      resultCode = 200;
      console.log(resultCode);
      message = "구글 계정 회원가입 성공!";
      console.log(message);
    } else {
      resultCode = 200;
      message = data[0][0].user_name + "님 환영합니다!";
    }
    console.log("33행");
    return res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  } catch (err) {
    console.log("39행");
    return res.status(500).json(err);
  }
});

module.exports = router;

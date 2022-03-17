const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", async (req, res, next) => {
  const {user_id, password} = req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      user_id,
    ]);
    if (data[0][0] == undefined) {
      // 계정이 없다면
      resultCode = 206;
      message = "존재하지 않는 계정입니다!";
    } else if (!bcrypt.compareSync(password, data[0][0].password)) {
      // 비밀번호가 다르다면
      resultCode = 204;
      message = "비밀번호가 틀렸습니다!";
    } else {
      // 다른 경우는 없다고 판단하여 성공
      resultCode = 200;
      message = "로그인 성공! " + data[0][0].user_name + "님 환영합니다!";
    }
    return res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

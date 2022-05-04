const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res, next) => {
  //next 추가하기 전에는 오류났었는데 next 없어도 되는 건지는 모르겠음
  console.log(req.body);
  const {
    user_id,
    password,
    user_name,
    nickname,
    mobile_no,
    push_allow,
    gender,
  } = req.body;
  const passwordBy = bcrypt.hashSync(password, 10); // sync
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    //문제 없으면 try문 실행
    const data = await pool.query(
      "INSERT INTO user (user_id, password, user_name, nickname, mobile_no, push_allow, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
      //insert에 딕셔너리 형태로 적었더니 오류 -> 리스트 형태가 맞음
      [user_id, passwordBy, user_name, nickname, mobile_no, push_allow, gender]
    );
    resultCode = 200;
    message = "회원가입에 성공했습니다!";
    console.log("회원가입 성공");
    return res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
    });
  } catch (err) {
    //에러 처리
    return res.status(500).json(err);
  }
});

module.exports = router;

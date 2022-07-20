const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const naver = {
  id: "ncp:sms:kr:286992432251:gdjang",
  console_secret: "LuPOlQ3q6em8ogtUwUpYNwCRCmfkDgaXTOkza9e8",
  access: "hBMU8Fn5CS2UYMptF749",
};

//회원가입
router.post("/", async (req, res, next) => {
  console.log(req.body);
  const {id, password, name, nickname, phone_number, push_allow, gender} =
    req.body;
  const passwordBy = bcrypt.hashSync(password, 10); // sync
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    //문제 없으면 try문 실행
    const data = await pool.query(
      "INSERT INTO user (user_id, password, user_name, nickname, mobile_no, push_allow, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, passwordBy, name, nickname, phone_number, push_allow, gender]
    );
    resultCode = 200;
    message = "회원가입에 성공했습니다!";
    console.log("회원가입 성공");
    return res.json({
      code: resultCode,
      message: message,
      id: id,
    });
  } catch (err) {
    //에러 처리
    return res.status(500).json(err);
  }
});

//id 중복확인
router.post("/id-check", async (req, res) => {
  const body = req.body;
  const id = body.id;
  let is_valid = true;

  try {
    const [result, field] = await pool.execute(
      `SELECT * FROM user WHERE user_id = ?`,
      [id]
    );
    // id가 이미 존재하면 is_valid 는 false
    if (result.length !== 0) is_valid = false;
    res.send({is_valid: is_valid});
  } catch (e) {
    res.status(500).send({msg: "server error"});
  }
});

// sms 인증
function makeSignature(time) {
  var space = " "; // one space
  var newLine = "\n"; // new line
  var method = "POST"; // method
  var url = `/sms/v2/services/${naver.id}/messages`; // url (include query string)
  var timestamp = time; // current timestamp (epoch)
  var accessKey = naver.access; // access key id (from portal or Sub Account)
  var secretKey = naver.console_secret; // secret key (from portal or Sub Account)

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  var hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
}

router.post("/phone-check", async (req, res) => {
  const body = req.body;
  const phone_number = body.phone_number;
  console.log(body);

  const sms_url = `https://sens.apigw.ntruss.com/sms/v2/services/${naver.id}/messages`;
  const time_stamp = Date.now().toString();
  const signature = makeSignature(time_stamp);
  let code = "";
  for (let i = 0; i < 6; i++) code += Math.floor(Math.random() * 10);
  try {
    const [result] = await pool.execute(
      `INSERT INTO sms_validation(phone_number, code, expire) VALUES (?, ?, NOW() + INTERVAL 3 MINUTE) ON DUPLICATE KEY UPDATE code = ?, expire = NOW() + INTERVAL 3 MINUTE`,
      [phone_number, code, code]
    );
    res.send({msg: "success"});
  } catch (e) {
    console.log(e);
    res.status(500).send({msg: "server error"});
  }
});

router.post("/phone-check/verify", async (req, res) => {
  const body = req.body;
  const code = body.code;
  const phone_number = body.phone_number;

  let phone_valid = false;

  console.log(code);
  try {
    const [result, field] = await pool.execute(
      `SELECT * FROM sms_validation WHERE phone_number = ?`,
      [phone_number]
    );
    const expire_time = new Date(result[0].expire).setHours(
      result[0].expire.getHours() + 9
    );
    const now = Date.now();
    console.log(now);
    console.log(expire_time, now);
    if (code === result[0].code && expire_time > now) {
      phone_valid = true;
    }

    res.send({phone_valid: phone_valid});
  } catch (e) {
    console.log(e);
    res.status(500).send({msg: "server error"});
  }
});

module.exports = router;

const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const CryptoJS = require("crypto-js");

//회원가입
router.post("/", async (req, res, next) => {
  const {id, password, name, phone_number} = req.body;
  const passwordBy = bcrypt.hashSync(password, 10); // sync
  var resultCode = 404;
  var message = "에러가 발생했습니다.";
  try {
    //문제 없으면 try문 실행
    const data = await pool.query(
      "INSERT INTO user (user_id, password, user_name, mobile_no) VALUES (?, ?, ?, ?)",
      [id, passwordBy, name, phone_number]
    );
    resultCode = 200;
    message = name + "님, 회원가입에 성공했습니다!";
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

// sms 인증
function makeSignature(time) {
  var space = " "; // one space
  var newLine = "\n"; // new line
  var method = "POST"; // method
  var url = `/sms/v2/services/${process.env.naver_id}/messages`; // url (include query string)
  var timestamp = time; // current timestamp (epoch)
  var accessKey = process.env.naver_access; // access key id (from portal or Sub Account)
  var secretKey = process.env.naver_console_secret; // secret key (from portal or Sub Account)

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

  const sms_url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.naver_id}/messages`;
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
    console.error(err);
    res.status(500).send({msg: "server error"});
  }
});

router.post("/phone-check/verify", async (req, res) => {
  const body = req.body;
  const code = body.code;
  const phone_number = body.phone_number;

  let phone_valid = false;

  try {
    const [result, field] = await pool.execute(
      `SELECT * FROM sms_validation WHERE phone_number = ?`,
      [phone_number]
    );
    const expire_time = new Date(result[0].expire).setHours(
      result[0].expire.getHours() + 9
    );
    const now = Date.now();

    if (code === result[0].code && expire_time > now) {
      phone_valid = true;
    }

    res.send({phone_valid: phone_valid});
  } catch (err) {
    console.error(err);
    res.status(500).send({msg: "server error"});
  }
});

router.get("/is_id_dup", async (req, res) => {
  let id = req.query.id;
  try {
    const [is_id_dup] = await pool.execute(
      `SELECT EXISTS (SELECT user_no FROM ggdjang.user WHERE user_id = ?) as no;`,
      [id]
    );
    
    if (is_id_dup[0].no){   // dup이면 1
      resultCode = 200;
      message = "id_dup";
    } else {
      resultCode = 200;
      message = "id_not_dup";
    }

    return res.json({
      code: resultCode,
      message: message,
      id: id,
    });
  } catch (err){
    console.error(err);
    res.status(500).send({msg: "server error"});
  }
});

module.exports = router;

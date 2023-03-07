const pool = require("../db");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/googleLogin", async (req, res, next) => {

  const {id, username, sns_type /*, id_token, access_token*/} =
    req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다";
  let refresh_token, access_token, first_login;

  try {
    let data = await pool.query("SELECT * FROM user WHERE user_id = ?", [id]);
    if (data[0][0] == undefined) {
      //계정이 없다면
      access_token = await jwt.sign(
        {
          id: id,
          name: username,
        },
        process.env.jwt_secret,
        {expiresIn: "1h"} //만료 시간 1시간
      );

      refresh_token = await jwt.sign(
        {
          id: id,
        },
        process.env.jwt_secret,
        {expiresIn: "14d"}
      );

      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 60000 * 60,
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 60000 * 60 * 24 * 14,
      });

      let data2 = await pool.query(
        "INSERT INTO user (user_id, user_name, sns_type, refresh_token) VALUES (?, ?, ?, ?)",
        [id, username, sns_type, refresh_token]
      );
      resultCode = 200;
      message = "구글 계정 회원가입 성공!";
      first_login= "0";
    } else {  //로그인
      resultCode = 200;
      message = data[0][0].user_name + "님 환영합니다!";
      first_login= data[0][0].first_login;
    }
    return res.json({
      code: resultCode,
      message: message,
      id: id,
      first_login: first_login, //최초 로그인인지 확인
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

const get_cookies = (req) => {
  if (req.headers.cookie) {
    let cookies = {};
    req.headers &&
      req.headers.cookie.split(";").forEach(function (cookie) {
        let parts = cookie.match(/(.*?)=(.*)$/);
        cookies[parts[1].trim()] = (parts[2] || "").trim();
      });
    return cookies;
  } else return undefined;
};

// access_token 만료 -> refresh token 을 이용해 재발급
router.get("/refresh", async (req, res) => {
  let refresh_token = get_cookies(req);

  if (refresh_token === undefined) {
    res.sendStatus(400);
  } else {
    refresh_token = refresh_token["refresh_token"];
    try {
      const refresh_verify = jwt.verify(refresh_token, process.env.jwt_secret);

      const [user, fields] = await db.execute(
        "SELECT * FROM user WHERE user_id = ?",
        [refresh_verify.id]
      );
      const access_token = await jwt.sign(
        {
          id: user[0].user_id,
          name: user[0].user_name,
        },
        process.env.jwt_secret,
        {expiresIn: "1h"}
      );

      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 60000 * 60,
        overwrite: true,
      });
      res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } catch (e) {
      res.status(401).send({msg: "retry login"});
    }
  }
});

module.exports = router;

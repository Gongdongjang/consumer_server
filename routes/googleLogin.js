const pool = require("../db");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwt_secret =
  "e43348b14eaa39321ae3e59047fcc5a4f44ac4e110bafbd129c03896a3cfa60465f011073e9a08499835dad2c29c344d5abfa1a9f66ae26868bf31293945f122";

router.post("/googleLogin", async (req, res, next) => {
  // console.log("구글 로그인");
  const {id, username, nickname, sns_type /*, id_token, access_token*/} =
    req.body;
  var resultCode = 404;
  var message = "에러가 발생했습니다";
  let refresh_token, access_token;

  // console.log(id_token);
  // console.log(access_token);

  try {
    let data = await pool.query("SELECT * FROM user WHERE user_id = ?", [id]);
    if (data[0][0] == undefined) {
      //계정이 없다면
      access_token = await jwt.sign(
        {
          id: id,
          nickname: nickname,
          name: username,
        },
        jwt_secret,
        {expiresIn: "1h"} //만료 시간 1시간
      );

      refresh_token = await jwt.sign(
        {
          id: id,
        },
        jwt_secret,
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
        "INSERT INTO user (user_id, user_name, nickname, sns_type, refresh_token) VALUES (?, ?, ?, ?, ?)",
        [id, username, nickname, sns_type, refresh_token]
      );
      resultCode = 200;
      message = "구글 계정 회원가입 성공!";
    } else {
      resultCode = 200;
      message = data[0][0].user_name + "님 환영합니다!";
    }
    return res.json({
      code: resultCode,
      message: message,
      user_id: id,
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
  console.log("91행");

  if (refresh_token === undefined) {
    res.sendStatus(400);
  } else {
    refresh_token = refresh_token["refresh_token"];
    try {
      const refresh_verify = jwt.verify(refresh_token, jwt_secret);

      const [user, fields] = await db.execute(
        "SELECT * FROM user WHERE user_id = ?",
        [refresh_verify.id]
      );
      const access_token = await jwt.sign(
        {
          id: user[0].user_id,
          nickname: user[0].nickname,
          name: user[0].user_name,
        },
        jwt_secret,
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

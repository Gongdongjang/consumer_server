const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = require("./config").jwt_secret;
// console.log(jwt_secret);
// const dotenv = require("dotenv");

// dotenv.config();

router.post("/login", async (req, res, next) => {
  const {user_id, password} = req.body;
  // const key = process.env.SECRET_KEY;
  // let token = "";
  let resultCode = 404;
  let message = "에러가 발생했습니다";

  try {
    //문제 없으면 try문 실행
    const data = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      user_id,
    ]);
    if (data[0][0] == undefined) {
      // 계정이 없다면
      resultCode = 206;
      message = "존재하지 않는 계정입니다!";
      access_token = "id_false";
    } else if (!bcrypt.compareSync(password, data[0][0].password)) {
      // 비밀번호가 다르다면
      resultCode = 204;
      message = "비밀번호가 틀렸습니다!";
      access_token = "pwd_false";
    } else {
      // 다른 경우는 없다고 판단하여 성공
      resultCode = 200;
      message = "로그인 성공! " + data[0][0].user_name + "님 환영합니다!";
      console.log("36");
      //이 아래부터 안돼
      const access_token = await jwt.sign(
        {
          id: data[0][0].user_id,
          nickname: data[0][0].nickname,
          name: data[0][0].user_name,
        },
        jwt_secret,
        {expiresIn: "1h"} //만료 시간 1시간
      );
      console.log("51행");

      const refresh_token = await jwt.sign(
        {
          id: data[0][0].user_id,
        },
        jwt_secret,
        {expiresIn: "14d"}
      );
      console.log("54행");
      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 60000 * 60,
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 60000 * 60 * 24 * 14,
      });
    }
    return res.json({
      code: resultCode,
      message: message,
      user_id: user_id,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

const get_cookies = (req) => {
  console.log("77행");

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

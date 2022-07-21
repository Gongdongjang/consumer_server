const jwt = require("jsonwebtoken");
require("dotenv").config();

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

const auth_middleware = async (req, res, next) => {
  if (req.originalUrl.indexOf("/login") !== -1) {
    // 로그인 관련 시도는 auth_middleware 통과하게
    console.log("login pass");
    next();
  } else {
    let token = get_cookies(req);
    if (token === undefined) {
      res.status(401).send({msg: "unauthorized"});
    } else {
      const access_token = token["access_token"];
      if (access_token === undefined) {
        // access_token 없으면 로그인 X 상태
        res.status(401).send({msg: "unauthorized"});
      } else {
        // access_token = access_token['access_token'];
        try {
          // access_token 유효하면 인증 완료
          req.decode = jwt.verify(access_token, process.env.jwt_secret);
          next();
        } catch (e) {
          // access_token 만료 -> /refresh 필요
          res.status(401).send({msg: "unauthorized"});
        }
      }
    }
  }
};

module.exports = auth_middleware;

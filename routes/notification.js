const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  //const userid = req.body.id;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    // const u_data = await pool.query(
    //   "SELECT user_no FROM user WHERE user_id=? ",
    //   [userid]
    // );
    // userno = u_data[0][0].user_no;

    //문제 없으면 try문 실행
    // const [notification_result] = await pool.execute(
    //   `SELECT * FROM notification WHERE userno=${userno}`
    // );

    const target="소비자";

    const [notification_result] = await pool.execute(
      `SELECT * FROM notification WHERE notification_target="소비자"`
    );
    resultCode = 200;
    message = "알림리스트 정보 보내기 성공";

    return res.json({
      code: resultCode,
      message: message,
      noti_result: notification_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
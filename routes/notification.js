const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const userid = req.body.id;

  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  try {
    const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid] );
    userno = u_data[0][0].user_no;

    const [noti_result] = await pool.execute(
      `SELECT notification_title, notification_content, notification_target, 
      notification_date, notification_push_type, status
      FROM notification LEFT JOIN notification_by_user ON
      notification.notification_id = notification_by_user.notification_id 
      WHERE notification_user=${userno} and status="SENT"
      ORDER BY notification_date DESC
      `
    );

    console.log(noti_result);

    // const [notification_person] = await pool.execute(
    //   `SELECT notification_id FROM notification_by_user WHERE notification_user=${userno}`
    // );

    // const target="소비자";

    // const [notification_result] = await pool.execute(
    //   `SELECT * FROM notification WHERE notification_target="소비자"`
    // );

 
    resultCode = 200;
    message = "알림리스트 정보 보내기 성공";

    return res.json({
      code: resultCode,
      message: message,
      noti_result: noti_result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
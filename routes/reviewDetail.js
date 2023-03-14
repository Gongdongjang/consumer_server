//다른 사람 리뷰에서 상단바 -> 다른 사람 이름 보이기

const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  const user_id = req.body.user_id;

  try {
    const [user_name] = await pool.execute(
      `SELECT user_name FROM user WHERE user_id = ${user_id}`
    );

    resultCode = 200;
    message = "다른 사람 리뷰 조회 성공";
 
    return res.json({
      code: resultCode,
      message: message,
      user_name: user_name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

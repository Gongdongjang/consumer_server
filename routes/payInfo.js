const pool = require("../db");
const express = require("express");
const e = require("express");
const router = express.Router();

//결제하기 클릭시 결제요쳥 user_id에 대한 유저정보 return
//결제성공적으로 완료했을 때에는 orderInsert에 삽입(orderInsert 브런치 merge하기)
router.post("/user", async (req, res, next) => {
    const {user_id} = req.body;
    let resultCode = 404;
    let message = "에러가 발생했습니다.";

    try {
        const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ",[user_id]);
        userno = u_data[0][0].user_no;
      
        //문제 없으면 try문 실행
        const [user_result] = await pool.execute(`SELECT user_name, mobile_no WHERE userno=${userno}`);

        resultCode = 200;
        message = "결제 사용자 정보 보내기O";

        return res.json({
        code: resultCode,
        message: message,
        pay_user_result: user_result,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;
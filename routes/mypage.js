const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/mypage", async (req, res, next) => {
    let user_id = req.query.user_id;

    try {
        const [user_info] = await pool.query(
            `SELECT user_name FROM user WHERE user_id = ?`, [user_id] 
        );

        resultCode = 200;
        message = "MyPage Username 보내기";

        return res.json({
        code: resultCode,
        message: message,
        user_info: user_info,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;
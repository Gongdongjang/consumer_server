const pool = require("../db");
const express = require("express");
const router = express.Router();

router.get("/notice", async (req, res, next) => {
    try {
        const [notice_list] = await pool.query(
            `SELECT notice_title, notice_context, notice_date FROM notice WHERE notice_date <= NOW() ORDER BY notice_date DESC;`
        );

        resultCode = 200;
        message = "Get Notice";

        return res.json({
        code: resultCode,
        message: message,
        notice_list: notice_list,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;
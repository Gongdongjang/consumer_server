const pool = require("../db");
const express = require("express");
const e = require("express");
const router = express.Router();

router.post("/isKeep", async (req, res, next) => {
    const {
        user_id,
        md_id,
    } = req.body;
    let resultCode = 404;
    let message = "에러가 발생했습니다.";

    try {
        const [keep_data] = await pool.query(
            "SELECT keep_id FROM keep where keep.user_id=? and keep.md_id=?",
            [user_id, md_id]
        );
        resultCode = 200;
        if (keep_data[0] == undefined){
            message = "notexist";
            return res.json({
                code: resultCode,
                message: message,
            });
        }
        else {
            message = "exist";
            return res.json({
                code: resultCode,
                message: message,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

router.post("/keep", async (req, res, next) => {
    const {
        user_id,
        md_id,
    } = req.body;
    let resultCode = 404;
    let message = "에러가 발생했습니다.";

    try {
        const [keep_data] = await pool.query(
            "SELECT keep_id FROM keep where keep.user_id=? and keep.md_id=?",
            [user_id, md_id]
        );
        resultCode = 200;

        if (keep_data[0] == undefined){  
            const data = await pool.query(
                "INSERT INTO keep (user_id, md_id) VALUES (?, ?)",
                [user_id, md_id]
            );
            message="insert"
            return res.json({
                code: resultCode,
                message: message,
                keep_data:keep_data,
            });
        }
        else{  
            const data = await pool.query(
                "DELETE FROM keep WHERE keep.user_id=? and keep.md_id=?",
                [user_id,md_id]
            );

            message="delete";
            return res.json({
                code: resultCode,
                message: message,
                keep_data:keep_data,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;

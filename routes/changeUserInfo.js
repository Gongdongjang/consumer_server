const pool = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { async } = require("@firebase/util");

// 소셜 확인
router.get("/check_id", async (req, res, next) => {
    let user_id = req.query.user_id;
    try {
        const [check_id] = await pool.execute(
            `SELECT sns_type FROM user WHERE user_id = ?`,
            [user_id]
        );
        if (check_id[0].sns_type == null){
            message = "not_sns"
        }
        else {
            message = "sns"
        }

        return res.json({
        code: resultCode,
        message: message,
        check_id: check_id,
        }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// 비밀번호 변경
router.get("/change_pw", async (req, res, next) => {
    let user_id = req.query.user_id;
    let password = req.query.password;
    let passwordBy = bcrypt.hashSync(password, 10); // sync
    try {
        const [change_pw] = await pool.execute(
            `UPDATE user SET password = ? where user_id = ?`,
            [passwordBy, user_id]
        );

        if (change_pw[0] == undefined){
            message = "id_not_exist"
        }

        resultCode = 200;
        message = "change_pw 성공";
        
        return res.json({
        code: resultCode,
        message: message,
        change_pw: change_pw,
        }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// 이름 변경
router.get("/change_name", async (req, res, next) => {
    let user_id = req.query.user_id;
    let user_name = req.query.user_name;
    try {
        const [change_name] = await pool.execute(
            `UPDATE user SET user_name = ? where user_id = ?`,
            [user_name, user_id]
        );

        resultCode = 200;
        message = "change_name 성공";
        
        return res.json({
        code: resultCode,
        message: message,
        change_name: change_name,
        }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// 연락처 변경
router.get("/change_phone", async (req, res, next) => {
    let user_id = req.query.user_id;
    let mobile_no = req.query.mobile_no;
    try {
        const [change_phone] = await pool.execute(
            `UPDATE user SET mobile_no = ? where user_id = ?`,
            [mobile_no, user_id]
        );

        resultCode = 200;
        message = "change_phone 성공";
        
        return res.json({
        code: resultCode,
        message: message,
        change_phone: change_phone,
        }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;
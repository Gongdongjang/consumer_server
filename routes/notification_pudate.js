const pool = require("../db");
const express = require("express");
const firebase = require('firebase-admin');
const firebaseCredential = require("../gdjang_firebase.json");
const scheduler = require('node-schedule');
const router = express.Router();

firebase.initializeApp({
    credential: firebase.credential.cert(firebaseCredential),
});

const createTokenMessage = (token, title, content) => {
    let message;

    message = {
        notification: {                
            title: title,
            body: content
        },
        data: {
            title: title,
            body: content
        },
            tokens: token
        }

    return message;
}

//알림테이블에 해당상품 픽업D-1 예약알림 존재 여부 파악 후 없으면 테이블에 Insert
const createPickUpMessage = async (title, content, userno, date) => {
    let result;
    [alarm_info]= 
    await pool.execute(`SELECT notification_title, notification_date FROM notification 
            JOIN notification_by_user ON notification.notification_id = notification_by_user.notification_id 
            WHERE notification_user=${userno} and notification_type="픽업D-1" `);

    if (alarm_info.length> 0){
        for (let i=0;i<alarm_info.length; i++){
            if (alarm_info[i].notification_title==title && alarm_info[i].notification_date==date) break;  // 중복알림 방지
        }
        console.log("이미 해당상품 예약알림 존재");
    } else{
        [result] = await pool.execute(`INSERT INTO notification (notification_title, notification_content, notification_type, notification_target,
            notification_push_type, notification_date) VALUES (?, ?, ?, ?, ?, ?)`, [title, content, "픽업D-1", "개인", "예약", date]);
        
        try {
            console.log(result.insertId);
            await pool.execute(`INSERT INTO notification_by_user (notification_user, notification_id, status) VALUES (?, ?, ?)`,
            [userno, result.insertId, 'SCHEDULED']);

            res.send({msg: "NOTIFICATION_RESERVE_SUCCESS"});
       // }
        } catch (e) {
            console.log(e);
        }
    }   
}

// 픽업 하루 전 확인 후 알림 예약
router.post('/push', async (req, res) => {
    
    const user_id = req.body.user_id;
    let userno, user_name, count;

    try{
        const u_data = await pool.query("SELECT user_no, fcm_token, user_name FROM user WHERE user_id=? ",[user_id]);
        userno = u_data[0][0].user_no;
        user_name=u_data[0][0].user_name;

        [pu_info] = await pool.execute(`SELECT md_name, order_pu_date FROM md JOIN ggdjang.order ON md.md_id = ggdjang.order.md_id WHERE ggdjang.order.user_id=${user_id}`);
        count=pu_info.length;
    } catch(error) {
        console.log(error);
    }

    let title, content;

    for(let i =0; i<count; i++) {
        const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
        const date = new Date(Date() + TIME_ZONE).toISOString().split('T')[0];
        console.log(pu_info[i].order_pu_date);

        let arr1 = date.split('-');
        let arr2 = pu_info[i].order_pu_date.split('-');
        let dat1 = new Date(arr1[0], arr1[1], arr1[2]);
        let dat2 = new Date(arr2[0], arr2[1], arr2[2]);

        // 날짜 차이 알아 내기 
        let diff = dat2 - dat1;
        let currDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨

        //3월 5일                       3월 3일
        //pu_time이 2일 전 일때 테이블에 넣기.
        //console.log(diff/currDay);
        const now= new Date();
        let tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        //console.log("내일:", tomorrow);
        tomorrow= tomorrow.toISOString().split('T')[0];
        console.log("내일:", tomorrow);

        if(parseInt(diff/currDay)==2)
        {
            title="["+ pu_info[i].md_name + "] 픽업 D-1 알림"  ;
            content="내일은 " + user_name+ "님이 구매하신 "+ pu_info[i].md_name+ " 픽업날입니다. 픽업 정보를 확인해보세요!" ;
            console.log(title);
        
            createPickUpMessage(title,content,userno,tomorrow);
        }
    }

})

module.exports = router; 
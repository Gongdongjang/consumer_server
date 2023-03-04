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

// 픽업 하루 전 확인 후 알림 예약
router.post('/push', async (req, res) => {

    console.log(req.body);
    
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
    let result;

    for(let i =0; i<count; i++) {
        //const noticeResult = await createNotification(body, image);
        const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
        const date = new Date(Date() + TIME_ZONE).toISOString().split('T')[0];
        //console.log(date);
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
        //if(pu_info[i].order_pu_date == date.getDate()+2)
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
            //console.log(content);
            [result] = await pool.execute(`INSERT INTO notification (notification_title, notification_content, notification_type, notification_target,
                notification_push_type, notification_date) VALUES (?, ?, ?, ?, ?, ?)`, [title, content, "픽업D-1", "개인", "예약", tomorrow]);
            
            try {
                console.log(result.insertId);
                await pool.execute(`INSERT INTO notification_by_user (notification_user, notification_id, status) VALUES (?, ?, ?)`,
                [userno, result.insertId, 'SCHEDULED']);

            //res.send({msg: "NOTIFICATION_RESERVE_SUCCESS"});
            //}
            } catch (e) {
                console.log(e);
            }

        }
    }

})

//예약된 알림 보내기
scheduler.scheduleJob('0 * * * *', async () => {
    const [notifications, field] = await pool.execute(`SELECT notification_id, notification_user, notification_target, notification_title, notification_content FROM notification 
                                                                  WHERE notification_push_type = ? AND notification_date BETWEEN NOW() and NOW() + INTERVAL 5 MINUTE`, ['예약']);

    for (const notification of notifications) {
        const notificationId = notification.notification_id;
        const target = notification.notification_target;
        const title = notification.notification_title;
        const userno = notification.notification_user;
        const content = notification.notification_content;

        const [users, fields] = await pool.execute(`SELECT notification_user FROM notification_by_user WHERE notification_id = ?`, [notificationId]);
        let userIds = [];
        for (let user of users) {
            userIds.push(user.notification_user);
        }

        if (target === '개인') {
            const u_data = await pool.query("SELECT fcm_token FROM user WHERE user_no=? ",[userno]);
            let token= u_data[0][0].fcm_token;

            const message = createTokenMessage(token, title, content);
            const msgResult = await firebase.messaging().sendMulticast(message);
            console.log(msgResult);
        }

        await db.execute(`UPDATE notification_by_user SET status = ? WHERE notification_id = ?`, ['SENT', notificationId]);
    }
})

module.exports = router;
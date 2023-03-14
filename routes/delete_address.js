const pool = require("../db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {

  const userid=req.body.id;
  const number=req.body.number;
  
  console.log("주소삭제 넘버:", number);

  let resultCode = 404;
  let message = "에러가 발생했습니다.";
  let first_time="yes";

  const u_data = await pool.query("SELECT user_no FROM user WHERE user_id=? ", [userid]);
  const userno=u_data[0][0].user_no;

  const [address] = await pool.query("SELECT loc1, loc2, loc3, standard_address FROM address_user WHERE userno=? ", [userno]);

  let sql1=`UPDATE address_user SET loc1= null WHERE userno = ?` ;
  let sql2=`UPDATE address_user SET loc2= null WHERE userno = ?` ;
  let sql3=`UPDATE address_user SET loc3= null WHERE userno = ?` ; 

  if(address[0]==undefined)//처음 회원가입
  first_time="yes" ;
  else first_time="no" ;

  try {

    //처음 주소 등록이면 주소 삭제 안되게
    if(first_time=="yes"){
      message= "처음 주소 등록시에는 주소 삭제 불가합니다.";
    } else {
      
    if(number=="1") {
      if(address[0].standard_address==address[0].loc1){
          message= "기준주소지로 설정되어 주소 삭제 불가합니다.";
      }else{
          const data = await pool.query(sql1, [userno]);
          message = "주소삭제완료";
          if(address[0].loc2 !=null && address[0].loc !=null ){ //주소2,3 있으면 주소1,2로 옮기기
              const move = await pool.query(`UPDATE address_user SET loc1=?, loc2=?, loc3=null WHERE userno = ?`, [address[0].loc2, address[0].loc3, userno]);
          } else {
              const move = await pool.query(`UPDATE address_user SET loc1=?, loc2=null WHERE userno = ?`, [address[0].loc2, userno]);
          }
      }
    }
    //주소2
    else if (number=="2") {
      if(address[0].standard_address==address[0].loc2){
          message= "기준주소지로 설정되어 주소 삭제 불가합니다.";
      }else{
          const data = await pool.query(sql2, [userno]);
          message = "주소삭제완료";
          if(address[0].loc3 !=null){ //주소3이 있으면 주소2 위치로 옮기기
              const move = await pool.query(`UPDATE address_user SET loc2=?, loc3=null WHERE userno = ?`, [address[0].loc3, userno]);
          }   
      }
    }
    //주소3
    else { //number=="3" 이면 안떙겨도 됨.
      if(address[0].standard_address==address[0].loc3){
             message= "기준주소지로 설정되어 주소 삭제 불가합니다.";
       }else{
            const data = await pool.query(sql3, [userno]);
            message = "주소삭제완료";
      }
    }  
    }




    resultCode = 200;

    return res.json({
      code: resultCode,
      message: message,
      userno: userno
    });
  } catch (err) {
    //에러 처리
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
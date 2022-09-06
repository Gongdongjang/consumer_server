const pool = require("../db");
const express = require("express");
const router = express.Router();

//받은 md_id에 대한 상세 데이터 return
router.post("/jointPurchase", async (req, res, next) => { 
  const {md_id} = req.body;     //최근 본 상품에서 userid랑 mdid recentlyMD테이블에 넣기. + 
  let resultCode = 404;
  let message = "에러가 발생했습니다.";

  //조회수 +1  상품 조회순 정렬할때 views 추가
  const views = await pool.query(`UPDATE md set md_views=md_views+1 where md_id =? `, [md_id] );

  //최근 본 상품id 가져오기
  const userid=113662857849161947466; //113662857849161947466
  const recentlyMD=await pool.query(`Select md_collection From recently_md Where userid=? `,[userid]);  //userid


  let md_list= new Array();
  if(recentlyMD[0].length>0){ //최근본 상품 테이블에 userid존재
    md_list=(recentlyMD[0][0].md_collection).split(",");
  }
  //console.log(md_list);
  //console.log(md_list.length);

  for(let i=0; i<md_list.length; i++){
    
    //md_collection에 md_id 있는 경우(중복삭제후) -> 맨뒤로
    console.log(Number(md_list[i]));
    
    if(Number(md_list[i])==md_id) {
      //console.log("md_id O");
      md_list[i]=='';
      md_list.push(md_id);
      break;
    }
    //md_collection에 md_id 없는 경우 -> 맨 뒤에 삽입
    if(i==(md_list.lengh-1)){
      console.log("md_id 없는 경우");
      md_list[md_list.length]=md_id;
    }
    i++;
  }

  console.log(md_list);


  //최근 본 상품 테이블 Insert
  try{
    const data = await pool.query(
      "INSERT INTO recently_md (user_id, md_collection) VALUES (?, ?)",[113662857849161947466, md_collection]
    );
  } catch(err){
    console.log(err);
    return res.status(500).json(err);
  }

  //md_id에 대한 상세 데이터 return
  try {
    //farmer_name 추가 필요
    //mdImg_thumbnail, mdImg_detail 맞는지 확인
    //모인인원 → 남은물품, 목표인원 → 목표 수량이 맞는지 확인
    //store_filesize, farm_size은 프로필 맞는지 확인

    //pay_price와 pay_comp 추가
    //store 위치정보 추가
    //order테이블 삽입 위해 store_id 추가
    const [md_detail_result] = await pool.query(
      'select mdimg_thumbnail, md_name, farm_name, stk_remain, stk_goal, pay_price, pay_comp, pu_start, pu_end, mdImg_detail, farm_info, store_filename, store.store_id, store_name, store_info, store_lat, store_long, store_loc from md join farm on md.farm_id=farm.farm_id join payment on md.md_id=payment.md_id join pickup on md.md_id=pickup.md_id join store on pickup.store_id=store.store_id join stock on md.md_id=stock.md_id join md_Img on md.md_id=md_Img.md_id where md.md_id = ?', md_id
    );

    resultCode = 200;
    message = "제품 상세로 정보보내기 성공";

    //let pay_schedule = new Date(md_detail_result[0].pay_schedule).toLocaleDateString();
    let pu_start = new Date(md_detail_result[0].pu_start).toLocaleDateString();
    let pu_end = new Date(md_detail_result[0].pu_end).toLocaleDateString();

    return res.json({
      code: resultCode,
      message: message,
      md_detail_result: md_detail_result,
      //pay_schedule:pay_schedule,
      pu_start:pu_start,
      pu_end:pu_end,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

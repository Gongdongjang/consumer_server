const express = require("express");
const app = express();
let bodyParser = require("body-parser");
const loginRouter = require("./routes/login.js");
const signupRouter = require("./routes/signup.js");
const googleLoginRouter = require("./routes/googleLogin.js");

const farmViewRouter = require("./routes/farmView.js");
const storeViewRouter = require("./routes/storeView.js");
const mdViewMainRouter = require("./routes/mdView_main.js");
const kakaoLoginRouter = require("./routes/kakaoLogin.js");
const farmDetailRouter = require("./routes/farmDetail.js");
const logoutRouter = require("./routes/logout");
const addressRouter = require("./routes/register_address.js");
const jointPurchaseRouter = require("./routes/jointPurchase.js");
const keepRouter = require("./routes/keep.js");
const keeplistRouter = require("./routes/keeplist.js");
const orderDetailRouter = require("./routes/orderDetail");
const orderDetailMdRouter = require("./routes/orderDetailMd");
const cartListRouter = require("./routes/cartList");
const mypageRouter = require("./routes/mypage");
const noticeRouter = require("./routes/notice");
const reviewRegisterRouter = require("./routes/reviewRegister");
const reviewListRouter = require("./routes/reviewList");
const changeRouter = require("./routes/changeUserInfo");
const contentListRouter = require("./routes/contentList");

const auth_middleware = require("./routes/auth_middleware");
// const refreshRouter = require("./routes/")

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("consumer_server");
});

app.get("/post_search", (req, res) => {
  res.sendFile(__dirname + "/postSearch.html");
});

app.use("/signup", signupRouter);
app.get("/is_id_dup", signupRouter);
app.use("/register_address", addressRouter);
app.use("/edit_address", require("./routes/edit_address.js"));
app.use("/get_address", require("./routes/get_address.js"));
app.use("/delete_address", require("./routes/delete_address.js"));
app.use("/standard_address", require("./routes/standard_address.js"));

app.post("/kakaoLogin", kakaoLoginRouter);
app.post("/googleLogin", googleLoginRouter);

app.post("/login", loginRouter);
app.get("/logout", logoutRouter);

app.use("/orderDetailView", orderDetailRouter);
app.use("/orderDetailMd", orderDetailMdRouter);

app.get("/farmView", farmViewRouter);
app.post("/farmDetail", farmDetailRouter);

app.get("/storeView", storeViewRouter);
app.post("/storeDetail", require("./routes/storeDetail.js"));
app.get("/mdView_main", mdViewMainRouter);

app.post("/jointPurchase", jointPurchaseRouter);

app.post("/cartPost", cartListRouter);
app.get("/cartList", cartListRouter);
app.get("/cartUpdate", cartListRouter);
app.get("/cartDelete", cartListRouter);
app.get("/cartChecked", cartListRouter);

app.post("/isKeep", keepRouter);
app.post("/keep", keepRouter);
app.post("/keeplist", keeplistRouter);

app.get("/mypage", mypageRouter);

app.get("/check_id", changeRouter);
app.get("/change_pw", changeRouter);
app.get("/change_name", changeRouter);
app.get("/change_phone", changeRouter);

app.get("/notice", noticeRouter);

app.use("/payUserInfo", require("./routes/payUserInfo.js"));
app.use("/orderInsert", require("./routes/orderInsert.js"));
app.use("/orderCancel", require("./routes/orderCancel.js"));

app.use("/notification", require("./routes/notification.js"));
app.use("/notification_pudate", require("./routes/notification_pudate.js"));

//알람
app.use("/alarm_token", require("./routes/alarm_token.js"));

//리뷰
app.use("/review", reviewRegisterRouter);
app.use("/reviewList", reviewListRouter);

//콘텐츠
app.use("/content", contentListRouter);
app.use("/contentDetail", require("./routes/contentDetail"));
app.use(auth_middleware);

app.listen(3000, function () {
  console.log("server is running.");
});

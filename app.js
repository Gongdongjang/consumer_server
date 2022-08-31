const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const loginRouter = require("./routes/login.js");
const signupRouter = require("./routes/signup.js");
const googleLoginRouter = require("./routes/googleLogin.js");
const agreePopupRouter = require("./routes/agreePopup.js");
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
app.use("/register_address", addressRouter);

app.post("/kakaoLogin", kakaoLoginRouter);
app.post("/googleLogin", googleLoginRouter);

app.post("/login", loginRouter);
app.get("/logout", logoutRouter);

app.post("/agreePopup", agreePopupRouter);

app.use("/orderDetailView", orderDetailRouter);
app.use("/orderDetailMd", orderDetailMdRouter);

app.get("/farmView", farmViewRouter);
app.post("/farmDetail", farmDetailRouter);

app.get("/storeView", storeViewRouter);
app.post("/storeDetail", require("./routes/storeDetail.js"));
app.get("/mdView_main", mdViewMainRouter);

app.post("/jointPurchase", jointPurchaseRouter);

app.post("/cartListView", cartListRouter);

app.post("/isKeep", keepRouter);
app.post("/keep", keepRouter);
app.post("/keeplist", keeplistRouter);

app.use(auth_middleware);

app.listen(3000, function () {
  console.log("server is running.");
});

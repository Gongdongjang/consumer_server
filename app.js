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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("consumer_server");
});
app.post("/login", loginRouter);
app.post("/signup", signupRouter);
app.post("/kakaoLogin", kakaoLoginRouter);
app.post("/googleLogin", googleLoginRouter);
app.post("/agreePopup", agreePopupRouter);
app.get("/farmView", farmViewRouter);
app.get("/storeView", storeViewRouter);
app.get("/mdView_main", mdViewMainRouter);

app.listen(3000, function () {
  console.log("server is running.");
});

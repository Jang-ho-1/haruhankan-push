const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/fcm", (req, res) => {
  console.log("📨 FCM 메시지 수신:", req.body);
  res.status(200).send("수신 완료");
});

app.get("/", (req, res) => {
  res.send("🚀 Haruhankan Push 서버 작동 중!");
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});

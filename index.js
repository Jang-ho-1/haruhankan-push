const express = require("express");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Render 환경에서 FIREBASE_ADMIN_KEY는 환경변수로 들어가 있어야 함
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 이 경로로 POST 요청하면 알림 발송됨
app.post("/send", async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    token,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send(`Successfully sent message: ${response}`);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Failed to send message");
  }
});

// 테스트용 GET
app.get("/", (req, res) => {
  res.send("Haruhankan Push Server is running!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

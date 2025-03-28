const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Firebase Admin 키를 환경변수에서 불러오기
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 공지사항 등록 요청을 받으면 FCM 알림 전송
app.post("/send-notice", async (req, res) => {
  const { groupId, title, body } = req.body;

  try {
    const groupDoc = await db.collection("groups").doc(groupId).get();
    const members = groupDoc.data().members || [];

    const tokens = [];
    for (const uid of members) {
      const userDoc = await db.collection("users").doc(uid).get();
      const token = userDoc.data().fcmToken;
      if (token) tokens.push(token);
    }

    const message = {
      notification: { title, body },
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ 알림 전송 완료:", response.successCount);
    res.status(200).send("알림 전송 성공");
  } catch (error) {
    console.error("❌ 알림 전송 실패:", error);
    res.status(500).send("알림 전송 실패");
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});

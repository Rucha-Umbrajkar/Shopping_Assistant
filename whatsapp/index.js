const express = require("express");
const app = express();

const { createAdkSession, sendMessageToAdk } = require("./adkService");

const userSessions = {}; // phone → { userId, sessionId }

// Twilio sends data as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.post("/whatsapp", async (req, res) => {
  const from = req.body.From; // whatsapp:+91...
  const userMessage = req.body.Body;

  console.log("📱 From:", from);
  console.log("💬 Message:", userMessage);

  // 🧠 If user is new, create ADK session
  if (!userSessions[from]) {
    const adkUserId = `whatsapp_${Date.now()}`;
    const adkSessionId = await createAdkSession(adkUserId);

    userSessions[from] = {
      adkUserId,
      adkSessionId,
    };

    console.log("🆕 ADK session created:", adkSessionId);
  }

  const { adkUserId, adkSessionId } = userSessions[from];

  // 🧠 Send message to ADK
  const adkReply = await sendMessageToAdk(adkUserId, adkSessionId, userMessage);

  console.log("🤖 ADK Reply:", adkReply);

  // 📤 Send reply back to WhatsApp
  res.send(`
    <Response>
      <Message>${adkReply}</Message>
    </Response>
  `);
});

app.listen(3050, () => {
  console.log("🚀 Server running on port 3050");
});

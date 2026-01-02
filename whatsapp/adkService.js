const axios = require("axios");

// ADK base URL (same as your React)
const ADK_BASE_URL = "http://127.0.0.1:5050";
const APP_NAME = "my_agent";

// 🧠 Create ADK session
async function createAdkSession(userId) {
  const response = await axios.post(
    `${ADK_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions`
  );

  return response.data.id; // sessionId
}

// 🧠 Extract final text (copied logic from React)
function extractFinalTextFromAdk(adkResponse) {
  if (!Array.isArray(adkResponse)) return "";

  for (let i = adkResponse.length - 1; i >= 0; i--) {
    const item = adkResponse[i];

    if (item?.content?.parts?.length) {
      const text = item.content.parts
        .map((p) => p.text)
        .join(" ")
        .trim();

      if (text) return text;
    }
  }

  return "";
}

// 🧠 Send message to ADK
async function sendMessageToAdk(userId, sessionId, userPrompt) {
  const response = await axios.post(`${ADK_BASE_URL}/run`, {
    appName: APP_NAME,
    userId,
    sessionId,
    newMessage: {
      role: "user",
      parts: [{ text: userPrompt }],
    },
    streaming: false,
  });

  const reply =
    extractFinalTextFromAdk(response.data) ||
    "🤖 I’m here, but I didn’t get a clear response.";

  return reply;
}

module.exports = {
  createAdkSession,
  sendMessageToAdk,
};

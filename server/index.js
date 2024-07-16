const express = require('express');
const cors = require('cors');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
  
const db = getDatabase();

app.post('/messages', async (req, res) => {
  const { chatId, message, userId } = req.body;
  await db.ref(`chats/${chatId}/messages`).push({ userId, message, timestamp: Date.now() });
  res.json({ message: 'Message sent' });
});

app.get('/messages/:chatId', async (req, res) => {
  const snapshot = await db.ref(`chats/${req.params.chatId}/messages`).get();
  res.json(snapshot.val());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

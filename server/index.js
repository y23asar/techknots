require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON env var (JSON string of service account).");
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI env var.");
  process.exit(1);
}

const client = new MongoClient(uri);
let db;
async function start() {
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'techknots');
  console.log('Connected to MongoDB');
}
start().catch(console.error);


/** Middleware: verify Firebase ID token in Authorization header Bearer <token> */
async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const idToken = auth.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
}

/** PUBLIC: list courses */
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.collection('courses').find({}).toArray();
    res.json(courses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

/** PROTECTED: enroll in a course (must be logged in) */
app.post('/api/enroll', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userUid = req.user.uid;
    if (!courseId) return res.status(400).json({ error: 'No courseId' });

    // Optional: check if course exists
    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Upsert enrollment
    const enr = {
      userUid,
      courseId: new ObjectId(courseId),
      enrolledAt: new Date()
    };

    await db.collection('enrollments').insertOne(enr);
    res.json({ success: true, enrollment: enr });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('API listening on', PORT));

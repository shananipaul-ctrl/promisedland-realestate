/***********************
 * PROMISEDLAND BACKEND
 * Render + Firebase
 ***********************/

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

/* ======================
   FIREBASE INIT (ENV)
====================== */
if (!process.env.FIREBASE_KEY) {
  throw new Error("❌ FIREBASE_KEY env variable not found");
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/* ======================
   APP INIT
====================== */
const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("PromisedLand Backend is Running 🚀");
});

/* ======================
   GET PROPERTIES
   ?approved=true|false
====================== */
app.get("/properties", async (req, res) => {
  try {
    const approved = req.query.approved;

    let query = db.collection("properties");

    if (approved !== undefined) {
      query = query.where("approved", "==", approved === "true");
    }

    const snapshot = await query
      .orderBy("createdAt", "desc")
      .get();

    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   ADD PROPERTY (PUBLIC)
====================== */
app.post("/properties", async (req, res) => {
  try {
    const data = {
      name: req.body.name || "",                 // Person / Company
      mobile: req.body.mobile,
      title: req.body.title,                     // Area / Title
      type: req.body.type || "sell",             // buy / rent / sell
      category: req.body.category || "plot",     // plot / house / etc
      district: req.body.district || "",
      village: req.body.village || "",
      price: Number(req.body.price),
      description: req.body.description || "",
      approved: false,                           // 🔴 ADMIN APPROVAL
      createdAt: new Date()
    };

    if (!data.title || !data.mobile || !data.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ref = await db.collection("properties").add(data);

    res.json({
      success: true,
      message: "Property submitted. Await admin approval.",
      id: ref.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   ADMIN – GET PENDING
====================== */
app.get("/admin/pending", async (req, res) => {
  try {
    const snapshot = await db
      .collection("properties")
      .where("approved", "==", false)
      .orderBy("createdAt", "desc")
      .get();

    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   ADMIN – APPROVE PROPERTY
====================== */
app.post("/admin/approve/:id", async (req, res) => {
  try {
    await db.collection("properties")
      .doc(req.params.id)
      .update({ approved: true });

    res.json({ success: true, message: "Property approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ===============================
// PROMISED LAND – FULL BACKEND
// ===============================

// ---------- IMPORTS ----------
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");

// ---------- EXPRESS APP ----------
const app = express();
app.use(cors());
app.use(express.json());

// ---------- FIREBASE ADMIN ----------
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ---------- MULTER (IMAGE UPLOAD) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("✅ PromisedLand Backend is Running 🚀");
});

// ===============================
// GET APPROVED PROPERTIES (PUBLIC)
// ===============================
app.get("/properties", async (req, res) => {
  try {
    const snapshot = await db
      .collection("properties")
      .where("approved", "==", true)
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

// ===============================
// ADD NEW PROPERTY (PUBLIC POST)
// ===============================
app.post("/properties", async (req, res) => {
  try {
    const data = {
      name: req.body.name || "",
      title: req.body.title,
      type: req.body.type || "Sell", // Buy / Sell / Rent
      category: req.body.category || "Plot",
      district: req.body.district,
      village: req.body.village,
      price: Number(req.body.price),
      mobile: req.body.mobile,
      description: req.body.description || "",
      image: req.body.image || "",
      approved: false, // 🔐 ADMIN APPROVAL REQUIRED
      createdAt: new Date()
    };

    if (!data.title || !data.mobile || !data.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ref = await db.collection("properties").add(data);
    res.json({ success: true, id: ref.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// IMAGE UPLOAD (FIREBASE STORAGE)
// ===============================
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const fileName = `property-images/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });

    await file.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    res.json({ imageUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ADMIN – VIEW ALL (APPROVED + PENDING)
// ===============================
app.get("/admin/properties", async (req, res) => {
  try {
    const snapshot = await db
      .collection("properties")
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

// ===============================
// ADMIN – APPROVE PROPERTY
// ===============================
app.post("/admin/approve/:id", async (req, res) => {
  try {
    await db
      .collection("properties")
      .doc(req.params.id)
      .update({ approved: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ADMIN – DELETE PROPERTY
// ===============================
app.delete("/admin/delete/:id", async (req, res) => {
  try {
    await db.collection("properties").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const app = express(); // ✅ app MUST be defined FIRST
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("PromisedLand Backend is Running 🚀");
});

// ✅ GET ALL PROPERTIES
app.get("/properties", async (req, res) => {
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

// ✅ ADD NEW PROPERTY
app.post("/properties", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      type: req.body.type || "sell",
      category: req.body.category || "land",
      district: req.body.district || "",
      village: req.body.village || "",
      price: Number(req.body.price),
      mobile: req.body.mobile,
      description: req.body.description || "",
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

// ✅ START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

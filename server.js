/*****************************************************
 PROMISEDLAND REAL ESTATE – ENTERPRISE MASTER BACKEND
 Render + Firebase Firestore + Firebase Storage
*****************************************************/

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");

/* ==================================================
   FIREBASE INIT (FROM ENV)
================================================== */
if (!process.env.FIREBASE_KEY) {
  throw new Error("❌ FIREBASE_KEY env variable not found");
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.project_id + ".appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

/* ==================================================
   APP INIT
================================================== */
const app = express();
app.use(cors());
app.use(express.json());

/* ==================================================
   MULTER CONFIG (Image Upload)
================================================== */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per image
});

/* ==================================================
   HEALTH CHECK
================================================== */
app.get("/", (req, res) => {
  res.send("PromisedLand Backend Enterprise Running 🚀");
});

/* ==================================================
   GET PROPERTIES (FILTER SUPPORTED)
   /properties?approved=true&type=sell&category=plot&district=Salem
================================================== */
app.get("/properties", async (req, res) => {
  try {
    let query = db.collection("properties");

    if (req.query.approved) {
      query = query.where(
        "approved",
        "==",
        req.query.approved === "true"
      );
    }

    if (req.query.type) {
      query = query.where("type", "==", req.query.type);
    }

    if (req.query.category) {
      query = query.where("category", "==", req.query.category);
    }

    if (req.query.district) {
      query = query.where("district", "==", req.query.district);
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

/* ==================================================
   POST PROPERTY (WITH IMAGE UPLOAD)
================================================== */
app.post("/properties", upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      mobile,
      title,
      type,
      category,
      district,
      village,
      price,
      description
    } = req.body;

    if (!title || !mobile || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* ===== Upload Images to Firebase Storage ===== */
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName =
          "properties/" +
          Date.now() +
          "_" +
          file.originalname;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: { contentType: file.mimetype }
        });

        await fileUpload.makePublic();

        const publicUrl =
          `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        imageUrls.push(publicUrl);
      }
    }

    /* ===== Save to Firestore ===== */
    const newProperty = {
      name: name || "",
      mobile,
      title,
      type: type || "sell",
      category: category || "plot",
      district: district || "",
      village: village || "",
      price: Number(price),
      description: description || "",
      imageUrls,
      approved: false,
      premium: false,
      status: "available",
      views: 0,
      createdAt: new Date()
    };

    const ref = await db.collection("properties").add(newProperty);

    /* ===== WhatsApp Admin Notification (Console Log) ===== */
    console.log(
      `📲 New Property Submitted:\nTitle: ${title}\nMobile: ${mobile}\nDistrict: ${district}`
    );

    res.json({
      success: true,
      id: ref.id,
      message: "Property submitted. Await admin approval."
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==================================================
   ADMIN – GET PENDING
================================================== */
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

/* ==================================================
   ADMIN – APPROVE PROPERTY
================================================== */
app.post("/admin/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("properties").doc(id).update({
      approved: true
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==================================================
   INCREMENT VIEW COUNT
================================================== */
app.post("/properties/:id/view", async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection("properties").doc(id);

    await ref.update({
      views: admin.firestore.FieldValue.increment(1)
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==================================================
   UPDATE STATUS (Available / Sold / Rented)
================================================== */
app.post("/admin/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await db.collection("properties").doc(req.params.id).update({
      status
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==================================================
   SERVER START
================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PromisedLand Enterprise Server running on ${PORT}`);
});

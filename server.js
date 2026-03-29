// server.js

require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

// ✅ CORS (restrict in production)
app.use(cors({
  origin: ["https://yourfrontend.com"], // 🔥 change this
  methods: ["GET", "POST"],
}));

app.use(express.json());

/* =========================================
   ✅ FIREBASE INIT (ONLY ONCE)
========================================= */
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();

/* =========================================
   ✅ RAZORPAY INIT
========================================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =========================================
   ✅ AUTH MIDDLEWARE (SECURE USER)
========================================= */
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

/* =========================================
   ✅ CREATE ORDER
========================================= */
app.post("/create-order", verifyUser, async (req, res) => {
  try {
    const options = {
      amount: 4000, // ₹40
      currency: "INR",
      receipt: `receipt_${req.uid}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

/* =========================================
   ✅ VERIFY PAYMENT
========================================= */
app.post("/verify-payment", verifyUser, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const uid = req.uid;

    // 🔐 Signature verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Update Firebase
    await db.ref(`users/${uid}`).update({
      isPaidMember: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paidAt: Date.now(),
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   ✅ HEALTH CHECK (OPTIONAL)
========================================= */
app.get("/", (req, res) => {
  res.send("Payment Server Running ✅");
});

/* =========================================
   ✅ START SERVER
========================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
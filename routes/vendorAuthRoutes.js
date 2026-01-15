// // const express = require("express");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const Vendor = require("../models/VendorModel");

// // const router = express.Router();

// // /* =========================
// //    VENDOR SIGNUP
// // ========================= */
// // router.post("/signup", async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     const existing = await Vendor.findOne({ email });
// //     if (existing) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Vendor already exists",
// //       });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     await Vendor.create({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       status: "PENDING",
// //     });

// //     res.json({
// //       success: true,
// //       message: "Signup successful. Waiting for admin approval.",
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Signup failed",
// //     });
// //   }
// // });

// // /* =========================
// //    VENDOR LOGIN (EMAIL + PASSWORD)
// // ========================= */
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const vendor = await Vendor.findOne({ email });
// //     if (!vendor) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid email or password",
// //       });
// //     }

// //     // 🔒 BLOCK LOGIN IF NOT APPROVED
// //     if (vendor.status !== "APPROVED") {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Your account is not approved by admin yet",
// //       });
// //     }

// //     const isMatch = await bcrypt.compare(password, vendor.password);
// //     if (!isMatch) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid email or password",
// //       });
// //     }

// //     const token = jwt.sign(
// //       { id: vendor._id, role: "vendor" },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({
// //       success: true,
// //       token,
// //       vendor: {
// //         id: vendor._id,
// //         name: vendor.name,
// //         email: vendor.email,
// //       },
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Login failed",
// //     });
// //   }
// // });

// // module.exports = router;


// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Vendor = require("../models/VendorModel");

// const router = express.Router();

// // --- VENDOR SIGNUP ---
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password, contactName, phone, vendorType, brandName, annualTurnover, onlineTurnover, website, presence, demographic } = req.body;

//     const existing = await Vendor.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Vendor already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newVendor = await Vendor.create({
//       contactName,
//       email,
//       password: hashedPassword,
//       phone,
//       vendorType,
//       brandName,
//       annualTurnover,
//       onlineTurnover,
//       website,
//       presence,
//       demographic,
//       status: "PENDING",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Signup successful. Waiting for admin approval.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Signup failed: " + err.message });
//   }
// });

// // --- VENDOR LOGIN ---
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const vendor = await Vendor.findOne({ email });

//     if (!vendor) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }

//     if (vendor.status !== "APPROVED") {
//       return res.status(403).json({ 
//         success: false, 
//         message: `Account ${vendor.status.toLowerCase()}. Please contact admin.` 
//       });
//     }

//     const isMatch = await bcrypt.compare(password, vendor.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { id: vendor._id, role: "vendor" },
//       process.env.JWT_SECRET || "yoursecretkey",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       vendor: { id: vendor._id, name: vendor.contactName, email: vendor.email },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Login failed" });
//   }
// });

// module.exports = router;





const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

const router = express.Router();

/* ================= VENDOR SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      email,
      password: hashedPassword,
      onboardingStep: "ACCOUNT_CREATED",
      isActive: false
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendorId: vendor._id
    });

  } catch (err) {
    console.error("Vendor signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
});

/* ================= VENDOR LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: vendor._id,
        role: "vendor",
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      }
    });

  } catch (err) {
    console.error("Vendor login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

module.exports = router;


// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const nodemailer = require("nodemailer");
// const cloudinary = require("../config/cloudinary");
// const Vendor = require("../models/VendorModel");

// const router = express.Router();

// // --- OTP Memory Storage ---
// let otpStore = {}; 

// // 1. SEND OTP ROUTE (Email logic)
// router.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore[email] = otp;

//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: process.env.EMAIL_SECURE === "true",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Havbit Vendor" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Email Verification Code",
//       html: `<h1 style="color: #2563eb;">OTP: ${otp}</h1><p>Valid for 10 minutes.</p>`,
//     });

//     res.json({ success: true, message: "OTP sent to " + email });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // --- MULTER SETUP ---
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const fileFields = upload.fields([
//   { name: 'gstFile', maxCount: 1 },
//   { name: 'panFile', maxCount: 1 },
//   { name: 'aadharFile', maxCount: 1 },
//   { name: 'ownerPhoto', maxCount: 1 }
// ]);

// // 2. SIGNUP ROUTE
// router.post("/signup", fileFields, async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existing = await Vendor.findOne({ email });
//     if (existing) return res.status(400).json({ success: false, message: "Vendor already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newVendor = await Vendor.create({ ...req.body, password: hashedPassword });

//     res.status(201).json({ success: true, message: "Signup successful" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Signup failed: " + err.message });
//   }
// });

// // 3. LOGIN ROUTE
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const vendor = await Vendor.findOne({ email });

//     if (!vendor || vendor.status !== "APPROVED") {
//       return res.status(403).json({ success: false, message: "Account not approved or not found" });
//     }

//     const isMatch = await bcrypt.compare(password, vendor.password);
//     if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     res.json({ success: true, token, vendor });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Login failed" });
//   }
// });

// // 🔥 YE LINE CHECK KARO - Sabse important hai 🔥
// module.exports = router;






// const express = require("express");
// const { sendVendorOTP, verifyVendorOTP } = require("../controllers/vendorAuth");
// const router = express.Router();

// router.post("/vendor/send-otp", sendVendorOTP);
// router.post("/vendor/verify-otp", verifyVendorOTP);

// module.exports = router;

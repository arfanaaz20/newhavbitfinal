const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

/* ================= SIGN UP ================= */
exports.signupVendor = async (req, res) => {
  try {
    const { email, password, name } = req.body;

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
      name: name || ""
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendorId: vendor._id
    });

  } catch (error) {
    console.error("signupVendor error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};

/* ================= LOGIN ================= */
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        vendorId: vendor._id,
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      }
    });

  } catch (error) {
    console.error("loginVendor error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

/* ================= UPLOAD DOCUMENTS ================= */
exports.uploadDocuments = async (req, res) => {
  try {
    const { gst, fssai, pan } = req.body;
    const vendorId = req.vendor.vendorId;

    if (!gst && !fssai && !pan) {
      return res.status(400).json({
        success: false,
        message: "At least one document is required"
      });
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    /* 🚫 PREVENT SPAM / RE-SUBMISSION */
    if (
      vendor.onboardingStep === "DOCUMENTS_SUBMITTED" ||
      vendor.onboardingStep === "APPROVED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Documents already submitted"
      });
    }

    /* ✅ SAVE DOCUMENTS */
    vendor.documents = {
      gst: gst || null,
      fssai: fssai || null,
      pan: pan || null
    };

    vendor.onboardingStep = "DOCUMENTS_SUBMITTED";
    vendor.isActive = false;

    await vendor.save();

    return res.json({
      success: true,
      message: "Documents submitted successfully. Awaiting admin approval"
    });

  } catch (error) {
    console.error("uploadDocuments error:", error);
    return res.status(500).json({
      success: false,
      message: "Document upload failed"
    });
  }
};


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

/* ================= SIGN UP ================= */
exports.signupVendor = async (req, res) => {
  try {
    const { email, password, name } = req.body;

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
      name: name || ""
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendorId: vendor._id
    });

  } catch (error) {
    console.error("signupVendor error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};

/* ================= LOGIN ================= */
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        vendorId: vendor._id,
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        onboardingStep: vendor.onboardingStep,
        isActive: vendor.isActive
      }
    });

  } catch (error) {
    console.error("loginVendor error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

/* ================= UPLOAD DOCUMENTS ================= */
exports.uploadDocuments = async (req, res) => {
  try {
    const { gst, fssai, pan } = req.body;
    const vendorId = req.vendor.vendorId;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    vendor.documents = { gst, fssai, pan };
    vendor.onboardingStep = "DOCUMENTS_SUBMITTED";
    await vendor.save();

    res.json({
      success: true,
      message: "Documents submitted, awaiting approval"
    });

  } catch (error) {
    console.error("uploadDocuments error:", error);
    res.status(500).json({
      success: false,
      message: "Document upload failed"
    });
  }
};

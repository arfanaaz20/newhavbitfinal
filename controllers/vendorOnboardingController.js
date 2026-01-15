const Vendor = require("../models/Vendor");
const cloudinary = require("../config/cloudinary");

/* ================= HELPER: UPLOAD TO CLOUDINARY ================= */
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

/* ================= SUBMIT ONBOARDING ================= */
exports.submitOnboarding = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const {
      brandName,
      businessType,
      gstNumber,
      panNumber,
      address,
      city,
      state,
      pincode
    } = req.body;

    /* 🔎 FIND VENDOR */
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    /* 🚫 BLOCK RE-SUBMISSION */
    if (
      vendor.onboardingStep === "DOCUMENTS_SUBMITTED" ||
      vendor.onboardingStep === "APPROVED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Onboarding already submitted"
      });
    }

    /* 🔒 BASIC VALIDATION */
    if (!brandName || !businessType || !gstNumber || !panNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required business details"
      });
    }

    if (!req.files?.gstFile || !req.files?.panFile) {
      return res.status(400).json({
        success: false,
        message: "GST and PAN documents are required"
      });
    }

    /* 🔐 FILE SIZE VALIDATION (10MB) */
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (req.files.gstFile[0].size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "GST file size must be less than 10MB"
      });
    }

    if (req.files.panFile[0].size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "PAN file size must be less than 10MB"
      });
    }

    if (req.files?.fssaiFile && req.files.fssaiFile[0].size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "FSSAI file size must be less than 10MB"
      });
    }

    /* ☁️ UPLOAD DOCUMENTS */
    const folder = `vendors/${vendorId}/documents`;

    const gstFileUrl = await uploadToCloudinary(
      req.files.gstFile[0],
      folder
    );

    const panFileUrl = await uploadToCloudinary(
      req.files.panFile[0],
      folder
    );

    const fssaiFileUrl = req.files?.fssaiFile
      ? await uploadToCloudinary(req.files.fssaiFile[0], folder)
      : null;

    /* 💾 SAVE ONBOARDING DATA */
    vendor.brandName = brandName;
    vendor.businessType = businessType;
    vendor.gstNumber = gstNumber;
    vendor.panNumber = panNumber;

    vendor.address = {
      address,
      city,
      state,
      pincode
    };

    vendor.documents = {
      gst: gstFileUrl,
      pan: panFileUrl,
      fssai: fssaiFileUrl
    };

    vendor.onboardingStep = "DOCUMENTS_SUBMITTED";
    vendor.isActive = false;

    await vendor.save();

    return res.json({
      success: true,
      message: "Onboarding submitted successfully. Waiting for admin approval"
    });

  } catch (error) {
    console.error("submitOnboarding error:", error);
    return res.status(500).json({
      success: false,
      message: "Onboarding submission failed"
    });
  }
};

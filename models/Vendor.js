// const mongoose = require("mongoose");

// const VendorSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//    image: { type: String, default: "" },
//   // ... baki fields
// }, { timestamps: true });

// // ✅ THIS LINE FIXES OVERWRITE ERROR
// module.exports = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);





const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    // 🔑 Onboarding flow
    onboardingStep: {
      type: String,
      enum: ["ACCOUNT_CREATED", "DOCUMENTS_SUBMITTED", "APPROVED"],
      default: "ACCOUNT_CREATED"
    },

    // 📄 Documents
    documents: {
      gst: { type: String, default: null },
      fssai: { type: String, default: null },
      pan: { type: String, default: null }
    },

    // ✅ Final access control
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

// const mongoose = require("mongoose");

// const vendorSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: { type: String, unique: true },

//     // OTP fields
//     otp: { type: String, default: null },
//     otpExpires: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// module.exports =
//   mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

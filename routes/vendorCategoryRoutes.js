const express = require("express");
const router = express.Router();

const cloudUpload = require("../middleware/cloudUpload");
const vendorAuth = require("../middleware/vendorAuth");
const vendorApproved = require("../middleware/vendorApproved");

const {
  createVendorCategory,
  getVendorCategories,
  getVendorCategoryById,
  updateVendorCategory,
  deleteVendorCategory
} = require("../controllers/vendorCategoryController");

/* ================= VENDOR PROTECTED ROUTES ================= */

// 1️⃣ Login required for everything
router.use(vendorAuth);

// 2️⃣ Approval required for business actions
router.use(vendorApproved);

// CREATE
router.post("/", cloudUpload.single("image"), createVendorCategory);

// READ ALL
router.get("/", getVendorCategories);

// READ SINGLE
router.get("/:id", getVendorCategoryById);

// UPDATE
router.put("/:id", cloudUpload.single("image"), updateVendorCategory);

// DELETE
router.delete("/:id", deleteVendorCategory);

module.exports = router;

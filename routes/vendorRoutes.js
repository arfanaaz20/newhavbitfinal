const express = require("express");
const router = express.Router();

const vendorAuth = require("../middleware/vendorAuth");
const vendorApproved = require("../middleware/vendorApproved"); // ✅ NEW

const productCtrl = require("../controllers/vendorProductController");
const subCtrl = require("../controllers/vendorSubCategoryController");
const catCtrl = require("../controllers/vendorCategoryController");

/* ================= CATEGORIES ================= */
// ❌ Blocked until onboarding + approval
router.get(
  "/categories",
  vendorAuth,
  vendorApproved,
  catCtrl.getVendorCategories
);

router.get(
  "/subcategories",
  vendorAuth,
  vendorApproved,
  subCtrl.getVendorSubCategories
);

/* ================= PRODUCTS ================= */
// ❌ Blocked until onboarding + approval
router.get(
  "/products",
  vendorAuth,
  vendorApproved,
  productCtrl.getVendorProducts
);

router.post(
  "/products",
  vendorAuth,
  vendorApproved,
  productCtrl.createVendorProduct
);

router.put(
  "/products/:id",
  vendorAuth,
  vendorApproved,
  productCtrl.updateVendorProduct
);

router.delete(
  "/products/:id",
  vendorAuth,
  vendorApproved,
  productCtrl.deleteVendorProduct
);

module.exports = router;

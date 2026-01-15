const express = require("express");
const multer = require("multer");

const vendorAuth = require("../middleware/vendorAuth");
const { submitOnboarding } = require("../controllers/vendorOnboardingController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/onboarding",
  vendorAuth,
  upload.fields([
    { name: "gstFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "fssaiFile", maxCount: 1 }
  ]),
  submitOnboarding
);

module.exports = router;

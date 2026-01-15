// const express = require("express");
// const router = express.Router();
// const vendorAuth = require("../middleware/vendorAuth");
// const upload = require("../middleware/upload");
// const controller = require("../controllers/vendorProductController");

// router.use(vendorAuth);

// router.get("/", controller.getVendorProducts);

// router.post(
//   "/",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "logo", maxCount: 1 },
//     { name: "gallery", maxCount: 5 },
//   ]),
//   controller.createVendorProduct
// );

// router.put("/:id", controller.updateVendorProduct);
// router.delete("/:id", controller.deleteVendorProduct);

// module.exports = router;



const express = require("express");
const router = express.Router();

const vendorAuth = require("../middleware/vendorAuth");
const vendorApproved = require("../middleware/vendorApproved");
const upload = require("../middleware/upload");
const controller = require("../controllers/vendorProductController");

/* ================= VENDOR PROTECTED ================= */

// Login required
router.use(vendorAuth);

// Approval required
router.use(vendorApproved);

/* GET */
router.get("/", controller.getVendorProducts);

/* CREATE */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  controller.createVendorProduct
);

/* UPDATE */
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  controller.updateVendorProduct
);

/* DELETE */
router.delete("/:id", controller.deleteVendorProduct);

module.exports = router;

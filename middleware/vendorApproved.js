const Vendor = require("../models/Vendor");

module.exports = async (req, res, next) => {
  try {
    const vendorId = req.vendor?.id;

    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: "Vendor ID missing"
      });
    }

    const vendor = await Vendor.findById(vendorId);

    if (
      !vendor ||
      vendor.onboardingStep !== "APPROVED" ||
      vendor.isActive !== true
    ) {
      return res.status(403).json({
        success: false,
        message: "Complete onboarding to access this section"
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Approval check failed"
    });
  }
};

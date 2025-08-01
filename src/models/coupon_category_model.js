const mongoose = require("mongoose");

const couponCategorySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String },
  },

  image: {
    type: String,
  },
  priority: {
    type: Number,
    default: 0,
  },
});

const CouponCategory = mongoose.model("CouponCategory", couponCategorySchema);

module.exports = CouponCategory;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let finalSchema = new Schema(
  {
    groupCode: {
      type: String,
    },
    groupQuantity: {
      type: Number,
    },
    // handle: {
    //   type: String,
    // },
    productID: {
      type: String,
    },
    sku: {
      type: String,
    },
    skuQuantity: {
      type: Number,
    },
    variantID: {
      type: String,
    },
    inventoryItemId: {
      type: String,
    },
  },
  {
    collection: "final",
  }
);

module.exports = mongoose.model("Final", finalSchema);

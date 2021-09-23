const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let uploadSchema = new Schema(
  {
    group: {
      type: String,
    },
    sku: {
      type: String,
    },
    quantity2: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
  },
  {
    collection: "uploads",
  }
);

module.exports = mongoose.model("Upload", uploadSchema);

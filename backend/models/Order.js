const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema(
  {
    line_items: [{}],
  },
  {
    collection: "order",
  }
);

module.exports = mongoose.model("Order", orderSchema);

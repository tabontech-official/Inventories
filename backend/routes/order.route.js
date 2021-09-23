let mongoose = require("mongoose"),
  express = require("express"),
  bodyParser = require("body-parser");
router = express.Router();
const app = express();
app.use(bodyParser.json());
const { default: axios } = require("axios");
// Upload Model
let orderSchema = require("../models/Order");

// CREATE Route
router.route("/webhooks/create-order").post(async (req, res, next) => {
  console.log("🎉 We got my order! hurrah!!");
  const theData = req.body;
  res.status(200).send("OK");
  // res.send(theData);
  // console.log(theData);
  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  var finalz = [];
  var locationID = 62885429453;
  // var uploads = [];
  const lineItems = theData.line_items;
  var finals2 = [];
  var adjust = [];
  var adjust2 = [];
  axios
    .get("https://brandfer.herokuapp.com/finals/")
    .then((response) => response.data)
    .then((finals) => {
      finalz.push(finals);
      // console.log(finals);
      console.log("inside finals");
      for (var l = 0; l < lineItems.length; l++) {
        for (var f = 0; f < finals.length; f++) {
          console.log(finals[f].variantID + "==" + lineItems[l].variant_id);

          if (finals[f].variantID == lineItems[l].variant_id) {
            console.log("inside if statement");
            finals2.push({
              groupCode: finals[f].groupCode,
              groupQuantity: finals[f].groupQuantity,
              productID: finals[f].productID,
              sku: finals[f].sku,
              skuQuantity: finals[f].skuQuantity,
              variantID: finals[f].variantID,
              inventoryItemId: finals[f].inventoryItemId,
              //  locationId: theData.location_id,
              locationId: locationID,
              quantity: lineItems[l].quantity,
            });
          }
        }
      }

      // console.log("checking finals2 now");
      // console.log(finals2);

      // fetching all inventroy item id in finals for given group code for shopify adjust query

      for (var f = 0; f < finals.length; f++) {
        for (var f2 = 0; f2 < finals2.length; f2++) {
          if (
            finals[f].groupCode == finals2[f2].groupCode &&
            finals2[f2].variantID != finals[f].variantID
          ) {
            adjust.push({
              _id: finals[f]._id,
              inventoryItemId: finals[f].inventoryItemId,
              locationId: theData.locationID,
              quantity: finals2[f2].quantity,
              groupQuantity: finals[f].groupQuantity,
              skuQuantity: finals[f].skuQuantity,
              finalQuantity: finals[f].groupQuantity - finals2[f2].quantity,
            });
          }

          if (finals2[f2].variantID == finals[f].variantID) {
            adjust2.push({
              _id: finals[f]._id,
              inventoryItemId: finals[f].inventoryItemId,
              locationId: locationID,
              quantity: finals2[f2].quantity,
              groupQuantity: finals[f].groupQuantity,
              skuQuantity: finals[f].skuQuantity,
              finalQuantity: finals[f].groupQuantity - finals2[f2].quantity,
            });
          }
        }
      }
      console.log("adjust start2");
      console.log(adjust);
      console.log("adjust end2");
      console.log("adjust2 start2");
      console.log(adjust2);
      console.log("adjust2 end2");

      // axios
      // .get("https://brandfer.herokuapp.com/uploads/")
      // .then((response) => response.data)
      // .then((data) => uploads.push(data));

      for (var a = 0; a < adjust.length; a++) {
        /// call final edit api and edit sku quantity and group quantity
        var finaldata = {
          groupQuantity: adjust[a].groupQuantity - adjust[a].quantity,
          skuQuantity: adjust[a].groupQuantity - adjust[a].quantity,
        };

        var uploadData = {
          quantity: adjust[a].groupQuantity - adjust[a].quantity,
          quantity2: adjust[a].groupQuantity - adjust[a].quantity,
        };
        //  console.log("finaldata:" + finaldata);
        axios.put(
          "https://brandfer.herokuapp.com/finals/update-final/" + adjust[a]._id,
          finaldata
        );

        //    .then((data) => console.log(data.data));

        // .then((response) => console.log(response));

        ////--------editing uploads-----------------------------------------------------------
        // axios
        //   .put(
        //     "https://brandfer.herokuapp.com/uploads/update-upload/" + adjust[a]._id,
        //     uploadData
        //   )

        //   .then((data) => console.log(data));

        // call shopify api and adjust inventory level using adjust.json
      }

      for (var a = 0; a < adjust2.length; a++) {
        var finaldata = {
          groupQuantity: adjust2[a].groupQuantity - adjust2[a].quantity,
          skuQuantity: adjust2[a].groupQuantity - adjust2[a].quantity,
        };

        var uploadData = {
          quantity: adjust2[a].groupQuantity - adjust2[a].quantity,
          quantity2: adjust2[a].groupQuantity - adjust2[a].quantity,
        };

        //   console.log("finaldata2:" + finaldata);
        axios.put(
          "https://brandfer.herokuapp.com/finals/update-final/" +
            adjust2[a]._id,
          finaldata
        );

        //  .then((data) => console.log(data.data));

        ////--------editing uploads-----------------------------------------------------------
        // axios
        //   .put(
        //     "https://brandfer.herokuapp.com/uploads/update-upload/" + adjust2[a]._id,
        //     uploadData
        //   )

        //   .then((data) => console.log(data));
      }

      for (var a = 0; a < adjust.length; a++) {
        let config = {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
          },
        };

        let mydata = {
          inventory_item_id: adjust[a].inventoryItemId,
          location_id: locationID,
          available: adjust[a].groupQuantity - adjust[a].quantity,
        };
        console.log("My data start");
        console.log(mydata);
        console.log("My data end");

        let url2 =
          "https://needynwanty.myshopify.com/admin/api/2021-07/inventory_levels/set.json";

        axios
          .post(url2, mydata, config)
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
      }

      // orderSchema.create(req.body, (error, data) => {
      //   console.log("🎉 We got the order! in orderSchema");
      //   if (error) {
      //     return next(error);
      //   } else {
      //     console.log(data);
      //     res.json(data);
      //   }
      // });

      // res.send(theData);
    });
});

router.route("/getLocation").post((req, res, next) => {
  //console.log(req.body);

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let config = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
    },
  };

  let url2 =
    "https://needynwanty.myshopify.com/admin/api/2019-07/locations.json";
  // "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2019-07/locations.json";

  axios.get(url2, config).then((resp) => {
    //   console.log(resp.data);
    res.json(resp.data);
  });
});

router.route("/getProductInfo").post((req, res, next) => {
  //  console.log(req.body);

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let config = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
    },
  };

  let url2 =
    "https://needynwanty.myshopify.com/admin/api/2019-07/products.json?fields=id,handle,title";

  // "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2019-07/locations.json";

  axios.get(url2, config).then((resp) => {
    //   console.log(resp.data);
    res.json(resp.data);
  });
});

router.route("/getVariants").post((req, res, next) => {
  // console.log("checking variants");
  // console.log(req.body);

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let config = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
    },
  };

  let url4 = `https://needynwanty.myshopify.com/admin/api/2019-07/products/${req.body.idz}/variants.json?fields=inventory_quantity,sku,id,product_id,inventory_item_id`;

  axios.get(url4, config).then((resp) => {
    //  console.log(resp.data);
    res.json(resp.data);
  });
});

router.route("/setInventory").post((req, res, next) => {
  //console.log("set Inventory");
  // console.log(req.body);

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let config = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
    },
  };

  let mydata = {
    inventory_item_id: req.body.inventory_item_id,
    location_id: req.body.location_id,
    available: req.body.available,
  };

  let url2 =
    "https://needynwanty.myshopify.com/admin/api/2021-07/inventory_levels/set.json";

  axios
    .post(url2, mydata, config)
    .then((resp) => {
      //   console.log(resp.data);
      res.send(resp.data);
    })
    .catch((error) => {});
});

router.route("/createWebhook").post((req, res, next) => {
  console.log(req.body);
  console.log("inside webhook backend");
  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let data3 = {
    webhook: {
      topic: "orders/create",
      address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
      format: "json",
    },
  };
  let config = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
    },
  };

  let url44 =
    "https://needynwanty.myshopify.com/admin/api/2021-07/webhooks.json";

  axios
    .post(url44, req.body, config)
    .then((resp) => {
      console.log(resp.data);

      res.send(resp.data);
    })
    .catch((error) => {
      //  console.log(error);
      res.send(error);
    });
});

router.route("/editWebhook").post((req, res, next) => {
  // const auth = {
  //   API: "f3663d02d5f03c5949e201ce23b63bc7",
  //   Password: "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",
  //   SharedSecret: "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",
  // };
  // var editdata = {
  //   webhook: {
  //     id: 1044923318477,
  //     address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
  //   },
  // };
  // let config = {
  //   headers: {
  //     Authorization:
  //       "Basic " +
  //       Buffer.from(`${auth.API}:${auth.Password}`).toString("base64"),
  //   },
  // };
  // let url55 =
  //   "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2021-07/webhooks/1044923318477.json";
  // axios
  //   .put(url55, editdata, config)
  //   .then((resp) => {
  //     //  console.log(resp.data);
  //     res.send(resp.data);
  //   })
  //   .catch((error) => {});
});

router.route("/webhooks/find-latest").get((req, res, next) => {
  orderSchema
    .find((error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    })
    .limit(1)
    .sort({ $natural: -1 });
});

// create webhook api
// router.route("/webhooks/create-order").post((req, res, next) => {
//   console.log("🎉 We got the order!");
//   const theData = req.body;
//   res.send(theData);
//   console.log(theData);
// });

// READ Route
router.route("/").get((req, res, next) => {
  orderSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get Single Route
router.route("/edit-order/:id").get((req, res, next) => {
  orderSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Route
router.route("/webhooks/update-order/:id").put((req, res, next) => {
  // console.log("🎉 We got the order!");
  const theData = req.body;
  // res.send(theData);
  console.log(theData.line_items);

  orderSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log("order updated successfully !");
      }
    }
  );
});

// Delete Route
router.route("/delete-order/:id").delete((req, res, next) => {
  orderSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;

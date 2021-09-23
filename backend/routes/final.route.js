let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();
const app = express();
const getRawBody = require("raw-body");
const crypto = require("crypto");
const secretKey = "f3663d02d5f03c5949e201ce23b63bc7";

// Upload Model
let finalSchema = require("../models/Final");

// CREATE Route
router.route("/create-final").post((req, res, next) => {
  finalSchema.create(req.body, (error, data) => {
    console.log("create-final touched");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

router.route("/delete").get((req, res, next) => {
  finalSchema.remove({}, (error, data) => {
    console.log("final delete ran");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

// READ Route
router.route("/").get((req, res, next) => {
  finalSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get Single Route
router.route("/edit-final/:id").get((req, res, next) => {
  finalSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Route
router.route("/update-final/:id").put((req, res, next) => {
  finalSchema.findByIdAndUpdate(
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
        console.log("finals updated successfully !");
      }
    }
  );
});

// Delete Route
router.route("/delete-final/:id").delete((req, res, next) => {
  finalSchema.findByIdAndRemove(req.params.id, (error, data) => {
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

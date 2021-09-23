let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();

// Upload Model
let uploadSchema = require("../models/Upload");

// CREATE Upload
router.route("/create-upload").post((req, res, next) => {
  uploadSchema.create(req.body, (error, data) => {
    console.log("create-upload touched");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

// READ Uploads
router.route("/").get((req, res, next) => {
  uploadSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get Single Upload
router.route("/edit-upload/:id").get((req, res, next) => {
  uploadSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Upload
router.route("/update-upload/:id").put((req, res, next) => {
  uploadSchema.findByIdAndUpdate(
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
        console.log("upload updated successfully !");
      }
    }
  );
});

// Delete Upload
router.route("/delete-upload/:id").delete((req, res, next) => {
  uploadSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

router.route("/delete").get((req, res, next) => {
  uploadSchema.remove({}, (error, data) => {
    console.log("upload delete ran");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

module.exports = router;

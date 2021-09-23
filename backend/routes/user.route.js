let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();

// Upload Model
let userSchema = require("../models/User");

// CREATE Upload
router.route("/create-user").post((req, res, next) => {
  userSchema.create(req.body, (error, data) => {
    console.log("create-upload touched");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

router.route("/login").post((req, res, next) => {
  userSchema
    .findOne({ email: req.body.email, password: req.body.password })
    .then((user) => {
      if (user) {
        return res.send({ result: true });
      } else {
        return res.send({ result: false });
      }
    });
});

router.route("/changepassword").post((req, res, next) => {
  userSchema
    .findOne({ email: req.body.email, password: req.body.password })
    .then((user) => {
      if (user) {
        // return res.send({ result: true });

        userSchema.findByIdAndUpdate(
          user._id,
          {
            $set: {
              password: req.body.newpassword,
            },
          },
          (error, data) => {
            if (error) {
              return next(error);
              console.log(error);
            } else {
              res.send({ result: true });
              console.log("password updated successfully !");
            }
          }
        );
      } else {
        return res.send({ result: false });
      }
    });
});

// READ Uploads
router.route("/").get((req, res, next) => {
  userSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get Single Upload
router.route("/edit-user/:id").get((req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Upload
router.route("/update-user/:id").put((req, res, next) => {
  userSchema.findByIdAndUpdate(
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
router.route("/delete-user/:id").delete((req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
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
  userSchema.remove({}, (error, data) => {
    console.log("user delete ran");
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

module.exports = router;

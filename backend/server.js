let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let bodyParser = require("body-parser");
let dbConfig = require("./database/db");
const app = express();
const path = require("path");

/// webhook resources
const getRawBody = require("raw-body");
const crypto = require("crypto");
const secretKey = "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";

// Express Route
const uploadRoute = require("./routes/upload.route");
const finalRoute = require("./routes/final.route");
const orderRoute = require("./routes/order.route");
const userRoute = require("./routes/user.route");

app.get("/", (req, res) => {
  res.send("Hello from Brandfer app");
});

// // Step 1:
// app.use(express.static(path.resolve(__dirname, "../build")));
// // Step 2:
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "../build", "index.html"));
// });

// Connecting mongoDB Database
mongoose.Promise = global.Promise;

require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
  })
  .then(
    () => {
      console.log("Database sucessfully connected!");
    },
    (error) => {
      console.log("Could not connect to database : " + error);
    }
  );

//Serve static assets if in production

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/uploads", uploadRoute);
app.use("/finals", finalRoute);
app.use("/orders", orderRoute);

app.use("/users", userRoute);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.json({ error: err });
});
// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});
// 404 Error
app.use((req, res, next) => {
  next(404);
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

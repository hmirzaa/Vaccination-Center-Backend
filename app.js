const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
var http = require("http").createServer(app);
require("dotenv").config();
const connectDB = require("./utils/db");
var multer = require('multer');
var upload = multer();


connectDB();

process.env.TZ = "Asia/Karachi";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var P = mongoose.Promise = require('bluebird');

var CentersModel = mongoose.model('CentersModel', new Schema({
  number: {type: String, unique: true},
  name: String,
  dailyCapacity: String,
  totalNurses: String,
  startTime: String,
  endTime: String,
}, {
  collection: 'centers',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
));


var centersData = [
  {number: 1, name: "Bukit Batok CC", dailyCapacity: 10, totalNurses: 2, startTime:6, endTime:9 },
  {number: 2, name: "Bukit Panjang CC", dailyCapacity: 5, totalNurses:3, startTime:9, endTime:12},
  {number: 3, name: "Bukit Timah CC", dailyCapacity: 50, totalNurses:4, startTime:12, endTime:15},
  {number: 4, name: "Outram Park Polyclinic", dailyCapacity: 100, totalNurses:6, startTime:15, endTime:18}
];


P.all(centersData.map(i => new CentersModel(i).save()))
  .then(() => console.log('Data saved'))
  .catch((err) => console.log('Error: ' + err))



app.use(express.json({ limit: "200mb", extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

 

var cors = require("cors");
app.use(cors());

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(async function (req, res, next) {
  next();
});

const routes = require("./routes/");
app.use("/", routes);
app.use(function (req, res, next) {
  return res.status(404).send("404");
});

const PORT = process.env.PORT;
http.listen(PORT, () => console.log(`Server started on port`, PORT));

module.exports = app;

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);

  if (reason == "user-limit-exceed") {
    console.log("object");
    return "send message here";
  }
});

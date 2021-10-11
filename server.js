require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");
const methodOverride = require('method-override');

var hbs = require("hbs");
const static = require("./routes/static");
const cars = require("./routes/cars");

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use("/", static);
app.use("/cars", cars);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "404.html"));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running`);
});


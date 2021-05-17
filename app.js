var createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const cors = require("cors");
//***** ///// *****//
var app = express();
var io = require("socket.io")();
app.io = io;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// app.use(cors());
app.use(cors({
  origin:['http://localhost:8081','http://127.0.0.1:8081'],
  credentials:true
}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public/images")));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use("/api", indexRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:8081");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.io.on("connection", async function (client) {
  
  client.on('test', async (data) => { //emit on this
    console.log('Data', data)
    app.io.emit("testEmit", data); //listen on this
  })

});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;

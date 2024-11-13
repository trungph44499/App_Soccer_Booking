var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var searchRouter = require("./routes/searchs");
var paymentRouter = require("./routes/payment");
var notificationRouter = require("./routes/notification");
var stadiumRouter = require("./routes/stadium");
var bookingRouter = require("./routes/booking");

var app = express();
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/searchs", searchRouter);
app.use("/pay", paymentRouter);
app.use("/notification", notificationRouter);
app.use("/stadiums", stadiumRouter);
app.use("/bookings", bookingRouter);

module.exports = app;

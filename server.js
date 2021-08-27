const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// DB Import
const Connection = require("./db.js");

const app = express();
const PORT = process.env.PORT;

// DB Called
Connection();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/", require("./Routes/Blog"));

app.get("/", (request, response) => {
  response.json({ message: "Welcome to Blog API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

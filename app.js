import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as mongoDB from "./mongodb-setup.js";

var app = express();

app.use(morgan("short")); // logger
app.use(express.static('static'));
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
    res.send("Hello world!")
});

app.get("/lessons", function (req, res) {
    res.json(mongoDB.find(mongoDB.collections.lessons, {}));
});

app.get("/search", function (req, res) {
});

// Page not found middleware
app.use(function (request, response) {
    response.status(404).send("Page not found!");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`App started on port ${port}`);
});
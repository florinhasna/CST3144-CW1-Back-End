import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as mongoDB from "./mongodb-setup.js";

var app = express();
var port = 3000;

app.use(morgan("short")); // logger
app.use(express.static('static'));
app.use(express.json());
app.use(cors());

app.get("/lessons", function (req, res) {
    res.json(mongoDB.find(mongoDB.collections.lessons, {}));
});

app.get("/search", function (req, res) {
});

// Page not found middleware
app.use(function (request, response) {
    response.status(404).send("Page not found!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

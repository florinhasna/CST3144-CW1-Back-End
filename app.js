import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as mongoDB from "./mongodb-setup.js";

var app = express();

app.use(morgan("short")); // logger
app.use(express.static('static')); // to access the images, so they can be returned
app.use(express.json());
app.use(cors());

// initial message when the URL is accessed
app.get("/", function (req, res) {
    res.send("Server created by Florin Hasna to host the back-end of CST3144 Coursework!")
});

// get to get lessons
app.get("/lessons", async function (req, res) {

    // log the action
    console.log({ "message": "Lessons requested, returning lessons." });
    res.json(await mongoDB.find(mongoDB.collections.lessons, {}));
});

// post to search the lessons
app.post("/search", async function (req, res) {

    // log the action
    console.log({
        "message": "Data received for searching. Searching...",
        "lookingFor": req.body.searchTerm
    });

    // set-up the query for searching
    const query = {
        $or: [
            { "title": { $regex: req.body.searchTerm, $options: "i" } },
            { "location": { $regex: req.body.searchTerm, $options: "i" } }
        ],
    }

    // send back the results
    res.json(await mongoDB.find(mongoDB.collections.lessons, query));
});

// post to place the order
app.post("/place-order", async function (req, res) {
    // log the action
    console.log({
        "message": "Data received for placing an order. Placing the order!",
        "order": req.body
    });

    // insert the entry in the collection
    await mongoDB.insert(mongoDB.collections.orders, req.body);
})

// Page not found middleware
app.use(function (request, response) {
    response.status(404).send("Page not found!");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`App started on port ${port}`);
});
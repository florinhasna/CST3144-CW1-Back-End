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

// sort parameteres
app.param("collection", function (req, res, next, collectionName) {
    // make firsrt letter uppercase, considering collections are named Lessons and not lessons
    collectionName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1).toLowerCase();
    req.collection = mongoDB.db.collection(collectionName);
    return next();
})

// sort parameteres for field and direction
app.param("sortBy", function (req, res, next, sortBy) {
    req.sortBy = sortBy.toLowerCase();
    return next();
})

app.param("sortDirection", function (req, res, next, sortDirection) {
    if (sortDirection.toLowerCase() === "ascending") {
        req.sortDirection = 1;
        return next();
    }
    if (sortDirection.toLowerCase() === "descending") {
        req.sortDirection = -1;
        return next();
    }

    req.sortDirection = sortDirection;
    return next();
})

// get to retrieve a collection
app.get("/collections/:collection/:sortBy/:sortDirection", async function (req, res) {
    // log the action
    console.log({
        "message": "Lessons requested, returning lessons.",
        "sortBy": req.sortBy,
        "sortDirection": req.sortDirection
    });
    res.json(await mongoDB.find(req.collection, {}, { sort: [[req.sortBy, req.sortDirection]] }));
});

// parameter for the search word
app.param("lookingFor", function (req, res, next, lookingFor) {
    req.lookingFor = lookingFor;
    return next();
});

// post to search the lessons
app.get("/collections/:collection/search/:lookingFor/:sortBy/:sortDirection", async function (req, res) {
    // log the action
    console.log({
        "message": "Data received for searching. Searching...",
        "lookingFor": req.lookingFor,
        "sortBy": req.sortBy,
        "sortDirection": req.sortDirection
    });

    // regex to search string-based fields
    const regex = new RegExp(req.lookingFor, 'i');

    // set-up the query for searching
    let conditions = [
        { "title": regex },
        { "location": regex },
    ]

    // check if the input is a numeric value
    if (!isNaN(req.lookingFor) && req.lookingFor.trim() !== '') {
        // add to conditions array if it is to search those fields too, convert input to integer
        conditions.push({ "price": parseInt(req.lookingFor) });
        conditions.push({ "availability": parseInt(req.lookingFor) });
    }

    let results = await mongoDB.find(req.collection, { $or: conditions }, { sort: [[req.sortBy, req.sortDirection]] });
    // send back the results
    res.json(results);
});

// post to place the order
app.post("/place-order", async function (req, res) {
    // log the action
    console.log({
        "message": "Data received for placing an order. Placing the order!",
        "order": req.body
    });

    // insert the entry in the collection
    let id = (await mongoDB.insert(mongoDB.collections.orders, req.body));
    res.json({
        "acknowledged": true,
        "insertId": id
    })
});

// put request to update an entry in the database, used for lessons
app.put("/collections/:collection/update", async function (req, res) {
    // log the action
    console.log({ "message": `Updating fields...`, });

    const results = await mongoDB.update(req.collection, req.body);

    res.send({
        "message": `success`,
        "fields": `${results.length} updated...`
    });
});

// Page not found middleware
app.use(function (request, response) {
    response.status(404).send("Page not found!");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`App started on port ${port}`);
});
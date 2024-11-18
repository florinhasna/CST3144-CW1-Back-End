import express from "express";
import morgan from "morgan";
import cors from "cors";
import PropertiesReader from "properties-reader";
import path from "path";
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

var app = express();
var port = 3000;

// making filename and dirname functional in ES module environment
// get the current file path 
const __filename = fileURLToPath(import.meta.url);
// get the directory name
const __dirname = path.dirname(__filename);

let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = PropertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbName + dbUrl + dbParams;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

app.use(morgan("short")); // logger
app.use(express.static('static'));
app.use(express.json());
app.use(cors());

app.get("/lessons", function (req, res) {
    res.json(lessonsData);
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

let lessonsData = [{
    id: 1000,
    title: "Painting",
    imgSrc: "assets/paint.svg",
    location: "Uxbridge",
    price: 100,
    availability: 5,
},
{
    id: 1001,
    title: "Math",
    imgSrc: "assets/math.svg",
    location: "Harrow",
    price: 75,
    availability: 5,
},
{
    id: 1002,
    title: "English - Grammar",
    imgSrc: "assets/english.svg",
    location: "Watford",
    price: 65,
    availability: 5,
},
{
    id: 1003,
    title: "Programming",
    imgSrc: "assets/programming.svg",
    location: "Hendon",
    price: 200,
    availability: 5,
},
{
    id: 1004,
    title: "Modern Foreign Languages",
    imgSrc: "assets/mfl.svg",
    location: "Uxbridge",
    price: 150,
    availability: 5,
},
{
    id: 1005,
    title: "Modern Arts",
    imgSrc: "assets/arts.svg",
    location: "Hendon",
    price: 75,
    availability: 5,
},
{
    id: 1006,
    title: "Physical Education",
    imgSrc: "assets/pe.svg",
    location: "Watford",
    price: 45,
    availability: 5,
},
{
    id: 1007,
    title: "Cooking",
    imgSrc: "assets/cooking.svg",
    location: "Harrow",
    price: 35,
    availability: 5,
},
{
    id: 1008,
    title: "Biology",
    imgSrc: "assets/biology.svg",
    location: "Harrow",
    price: 55,
    availability: 5,
},
{
    id: 1009,
    title: "Psychology",
    imgSrc: "assets/psychology.svg",
    location: "Watford",
    price: 70,
    availability: 5,
},
{
    id: 1010,
    title: "Music",
    imgSrc: "assets/music.svg",
    location: "Uxbridge",
    price: 110,
    availability: 5,
}];
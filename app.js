import express from "express";
import morgan from "morgan";


var app = express();
var port = 3000;

app.use(morgan("short"));
app.use(express.static('static'));

app.get("/lessons", function (req, res) {
    res.send({ lessons: lessonsData });
});

app.get("/search", function (req, res) {
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
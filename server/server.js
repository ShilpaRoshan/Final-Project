const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const csurf = require("csurf");

const {
    getLocations,
    getPacketSize,
    getTimeSlot,
    getResultsINeedHelp,
} = require("../db");

const app = express();

app.use(compression());

//middleware for the request.body
app.use(express.urlencoded({ extended: false }));
//middleware for the json(request.body)
app.use(express.json());
//cookie-session middleware
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

//csurf middle ware
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
//middle ware of path
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", (request, response) => {
    response.json({
        1: request.session.userId,
    });
    console.log("[id.json]", request.session.userId);
});
app.get("/api/locations", (request, response) => {
    getLocations().then((results) => {
        console.log("[getLocations-server]", results);
        response.json(results);
    });
});

app.get("/api/packet-size", (request, response) => {
    getPacketSize().then((results) => {
        console.log("[getPacketSize-server]", results);
        response.json(results);
    });
});

app.get("/api/time-slot", (request, response) => {
    getTimeSlot().then((results) => {
        console.log("[getTimeSlot-server]", results);
        response.json(results);
    });
});

app.get("/api/list/carriers", (request, response) => {
    const { time_slot, size } = request.body;
    getResultsINeedHelp({ time_slot, size }).then((results) => {
        console.log("[getResultsINeedHelp]", results.time_slot, results.size);
        response.json({ time_slot, size });
    });
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(3001, () => console.log("Server is listening"));

const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const csurf = require("csurf");

const { getLocations, getResultsINeedHelp } = require("../db");

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
    request.session.userId = 1;
    response.json({
        id: 1,
    });
    console.log("[id.json]", request.session.userId);
});
app.get("/api/locations", (request, response) => {
    getLocations().then((results) => {
        //console.log("[getLocations-server]", results);
        response.json(results);
    });
});

app.get("/api/search", (request, response) => {
    getResultsINeedHelp(request.query).then((results) => {
        console.log("[getResultsINeedHelp-server]", request.query);

        response.json(results);
    });
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(3001, () => console.log("Server is listening"));

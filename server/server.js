const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const csurf = require("csurf");

const {
    getUserByEmail,
    getLocations,
    getResultsINeedHelp,
    createDelivery,
    updateStatus,
    getAvailabilityById,
    updateAvailabilityById,
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
    //request.session.userId = 1;
    response.json({
        id: request.session.userId,
    });
    console.log("[id.json]", request.session.userId);
});
app.post("/api/login", (request, response) => {
    const { email } = request.body;
    if (email === "helpplease@gmail.com") {
        request.session.userId = 1;
    } else if (email === "canhelp@gmail.com") {
        request.session.userId = 2;
    }
    response.json({ message: "login successful!" });
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

// buuton-send
// app.get("/api/deliveries", (request, response) => {
//     createDelivery({
//         requester_id: request.session.userId,
//         carrier_id: request.body.availability_id,
//         status: "Pending",
//     }).then((delivery) => {
//         console.log("[createDelivery]", delivery);
//         response.json(delivery);
//     });
// });

app.post("/api/user/availability", async (request, response) => {
    const availability = await getAvailabilityById(
        request.body.availability_id
    );
    console.log("availability", availability);
    //2if there is existing delivery for availability_id & request.session.userId
    //response.statusCode = 400;
    //response.json({message:"existing"})
    if (availability) {
        response.statusCode = 400;
        response.json({ message: "existing" });
    }

    //1create new delievry with status pending
    //app.get("")
    createDelivery({
        requester_id: request.session.userId,
        carrier_id: availability.user_id,
        status: "Pending",
    }).then((delivery) => {
        console.log("[createDelivery]", delivery);
        response.json({ delivery });
    });
});

app.put("/api/user/availability", (response, request) => {
    getAvailabilityById(request.session.userId).then((availability) => {
        console.log("[availability-put]", availability);
        updateAvailabilityById(availability.user_id).then((result) => {
            console.log("[updateAvailabilityById]", result);
            response.json(result);
        });
    });
});

app.put("/api/deliveries/:id", (request, response) => {
    updateStatus({
        requester_id: request.session.userId,
        carrier_id: request.params.id,
        status,
    }).then((status) => {
        console.log("[updateStatus]", status);
        response.json(status);
    });
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(3001, () => console.log("Server is listening"));

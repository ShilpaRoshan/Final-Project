const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const csurf = require("csurf");

const {
    // getUserByEmail,
    getLocations,
    getResultsINeedHelp,
    createDelivery,
    updateDeliveryStatus,
    getAvailabilityById,
    updateAvailabilityById,
    getDeliveryByAvalAndUser,
    getDeliveriesByCarrierId,
    getAvailabilityByUserId,
    getListOfUsersByAcceptedStatus,
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
        console.log("[request.session.userId]", request.session.userId);
    } else if (email === "canhelp@gmail.com") {
        request.session.userId = 2;
        console.log("[request.session.userId]", request.session, request.body);
    }
    response.json({ message: "login successful!" });
});
//to get the locations in the drop-down of forms(I need help & i can help)
app.get("/api/locations", (request, response) => {
    getLocations().then((results) => {
        //console.log("[getLocations-server]", results);
        response.json(results);
    });
});

//to get list of people who can help after filling in the form of I need help
app.get("/api/search", (request, response) => {
    getResultsINeedHelp(request.query).then((results) => {
        console.log("[getResultsINeedHelp-server]", request.query);
        response.json(results);
    });
});

//to check if there is an delivery with the 2 ids else create the deliveries database
app.post("/api/deliveries", async (request, response) => {
    const availability = await getAvailabilityById(
        request.body.availability_id
    );
    console.log("availability", availability);
    //2if there is existing delivery for availability_id & request.session.userId
    //response.statusCode = 400;
    //response.json({message:"existing"})
    getDeliveryByAvalAndUser({
        carrier_id: availability.user_id,
        requester_id: request.session.userId,
    }).then((existingDelivery) => {
        console.log("existingDelivery", existingDelivery);
        if (existingDelivery) {
            response.statusCode = 400;
            response.json({ message: "existing" });
            return;
        }
        createDelivery({
            requester_id: request.session.userId,
            carrier_id: availability.user_id,
            status: "Pending",
        }).then((delivery) => {
            console.log("[createDelivery]", delivery);
            response.json({ delivery });
        });
    });
});
app.get("/api/user/availability", async (request, response) => {
    const value = await getAvailabilityByUserId(request.session.userId);
    response.json(value);
});
//to update the availabilities database from i can help component
app.put("/api/user/availability", (request, response) => {
    //console.log("hello!");
    console.log("[request-body]", request.body);
    //console.log("[userId]", request.session);
    const user_id = request.session.userId;
    console.log("[userId]", user_id);

    updateAvailabilityById({
        user_id,
        ...request.body,
    }).then((result) => {
        console.log("[updateAvailabilityById]", result);
        response.json(result);
    });
});
//to update the status from pending to accepted or rejected
app.put("/api/deliveries/:id", (request, response) => {
    updateDeliveryStatus({
        id: request.params.id,
        status: request.body.status,
    }).then((status) => {
        console.log("[updateStatus]", status);
        response.json(status);
    });
});
//to get the list of incoming requestes from the i need help component
app.get("/api/deliveries/incoming", (request, response) => {
    getDeliveriesByCarrierId({ carrier_id: request.session.userId }).then(
        (list) => {
            console.log("[getDeliveriesByCarrierId-server]", list);
            response.json(list);
        }
    );
    //method getDeliveries
});

app.get("/api/deliveries/accepted", (request, response) => {
    getListOfUsersByAcceptedStatus({ carrier_id: request.session.userId }).then(
        (list) => {
            console.log("[getListOfUsersByStatus]", list);
            response.json(list);
        }
    );
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(3001, () => console.log("Server is listening"));

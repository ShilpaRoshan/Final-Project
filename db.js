const spicedPg = require("spiced-pg");

const database = "delivery";
console.log(`Connecting to database ${database}`);

function getDataBaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}
const db = spicedPg(getDataBaseURL());

function getUserByEmail(email) {
    return db
        .query(`SELECT * FROM users WHERE email LIKE $1`, [email])
        .then((result) => {
            console.log("[getUserByEmail-db]", result.rows[0]);
            return result.rows[0];
        });
}

function getLocations() {
    return db.query(`SELECT * from locations`).then((results) => {
        //console.log("[getlocations-db]", results.rows);
        return results.rows;
    });
}

function getResultsINeedHelp({ time_slot, size, origin_id, destination_id }) {
    return db
        .query(
            `SELECT users.first_name, availabilities.time_slot, availabilities.size, origin.name AS origin_name,
                    destination.name AS destination_name, availabilities.id
                    FROM users
                    JOIN availabilities
                    ON(availabilities.user_id = users.id)
                    LEFT JOIN locations AS origin
                    ON(origin.id = availabilities.origin_id)
                    LEFT JOIN locations AS destination
                    ON(destination.id = availabilities.destination_id) 
                    WHERE availabilities.time_slot = $1 
                    AND availabilities.size = $2 
                    AND availabilities.origin_id = $3 
                    AND availabilities.destination_id = $4;`,
            [time_slot, size, origin_id, destination_id]
        )
        .then((results) => {
            //console.log("getResultsINeedHelp-db", results.rows);
            console.log("[getResultsINeedHelp]", {
                time_slot,
                size,
                origin_id,
                destination_id,
            });
            return results.rows;
        });
}

// function getRelation({ requester_id, carrier_id }) {
//     return db
//         .query(
//             `SELECT * FROM deliveries
//                     WHERE requester_id = $1 AND carrier_id = $2
//                     OR requester_id = $2 AND carrier_id = $1`,
//             [requester_id, carrier_id]
//         )
//         .then((result) => {
//             console.log("[getRelation]", result.rows[0]);
//             return result.rows[0];
//         });
// }

function createDelivery({ requester_id, carrier_id, status }) {
    return db
        .query(
            `INSERT INTO deliveries (requester_id, carrier_id, status) VALUES ($1, $2, $3) RETURNING *`,
            [requester_id, carrier_id, status]
        )
        .then((results) => {
            console.log("[createDelivery- db-file]", results.rows[0]);
            return results.rows[0];
        });
}
function updateStatus({ requester_id, carrier_id, status }) {
    return db
        .query(
            `UPDATE deliveries SET status = $1 WHERE requester_id = $2 AND carrier_id = $3 RETURNING *`,
            [requester_id, carrier_id, status]
        )
        .then((result) => {
            console.log("[updateStatus]", result.rows[0]);
            return result.rows[0];
        });
}
function getAvailabilityById(id) {
    return db
        .query(`SELECT * FROM availabilities WHERE id = $1`, [id])
        .then((result) => {
            return result.rows[0];
        });
}
function updateAvailabilityById(id) {
    return db
        .query(`UPDATE * FROM availabilities WHERE id =$1`, [id])
        .then((result) => {
            console.log("[updateAvailabilityById]", result.rows[0]);
            return result.rows[0];
        });
}
function getDeliveriesByCarrierId(carrier_id) {
    return db
        .query(`SELECT * FROM deliveries WHERE carrier_id = $1`, [carrier_id])
        .then((result) => {
            console.log("[getDeliveriesByCarrierId]", result.rows);
            return result.rows;
        });
}
function getDeliveriesByRequestorId(requester_id) {
    return db
        .query(`SELECT * FROM deliveries WHERE requester_id = $1`, [
            requester_id,
        ])
        .then((result) => {
            console.log("[getDeliveriesByRequestorId]", result.rows);
            return result.rows;
        });
}
module.exports = {
    // allUsers,
    getUserByEmail,
    getLocations,
    getResultsINeedHelp,
    createDelivery,
    updateStatus,
    getAvailabilityById,
    getDeliveriesByCarrierId,
    getDeliveriesByRequestorId,
    updateAvailabilityById,
};

//  INSERT INTO delivery (origin,destination,time,size,usertype,means) VALUES ('Prenzlauer Berg','Charlottenburg','weekend','M','A');
//  INSERT INTO delivery (origin,destination,time,size,usertype,means) VALUES('Prenzlauer Berg','Charlottenburg','weekend','M','B','bike');

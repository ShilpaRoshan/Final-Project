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
                    destination.name AS destination_name
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

module.exports = {
    // allUsers,
    getLocations,

    getResultsINeedHelp,
};

//  INSERT INTO delivery (origin,destination,time,size,usertype,means) VALUES ('Prenzlauer Berg','Charlottenburg','weekend','M','A');
//  INSERT INTO delivery (origin,destination,time,size,usertype,means) VALUES('Prenzlauer Berg','Charlottenburg','weekend','M','B','bike');

DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS availabilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS locations;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE deliveries(
    id SERIAL PRIMARY KEY,
    carrier_id INT REFERENCES users (id) NOT NULL,
    requester_id INT REFERENCES users (id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR 
);

CREATE TABLE availabilities(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) NOT NULL,
    origin_id INT REFERENCES locations (id) NOT NULL,
    destination_id INT REFERENCES locations (id) NOT NULL,
    time_slot VARCHAR,
    size VARCHAR
);


-- INSERT INTO users (id, first_name, last_name) VALUES (1,'A','B'),(2,'c','d');
-- INSERT INTO locations (id, name) VALUES (1,'Charlottenburg'),(2,'Wedding');
-- INSERT INTO availabilities (user_id, origin_id, destination_id,time_slot, size) VALUES (2,1,2,'daily','M');



-- SELECT users.first_name, availabilities.time_slot, availabilities.size, locations.name
-- FROM users
-- JOIN availabilities
-- ON(availabilities.user_id = users.id)
-- LEFT JOIN locations
-- ON(locations.id = availabilities.origin_id)
-- WHERE availabilities.time_slot = 'daily' AND availabilities.size = 'M';

SELECT users.first_name, availabilities.time_slot, availabilities.size, origin.name AS origin_name,
                    destination.name AS destination_name
                    FROM users
                    JOIN availabilities
                    ON(availabilities.user_id = users.id)
                    LEFT JOIN locations AS origin
                    ON(origin.id = availabilities.origin_id)
                    LEFT JOIN locations AS destination
                    ON(destination.id = availabilities.destination_id) 
                    WHERE availabilities.time_slot = 'daily' AND availabilities.size = 'M' AND availabilities.origin_id = 1 AND availabilities.destination_id = 2;
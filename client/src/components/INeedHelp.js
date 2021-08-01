import { useState, useEffect } from "react";

import axios from "../axios";
export default function INeedHelp() {
    const [locations, setLocations] = useState([]);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState({
        size: "S",
        time_slot: "daily",
        origin_id: 1,
        destination_id: 2,
    });

    useEffect(() => {
        axios.get("/api/locations").then((response) => {
            console.log("[getlocations]", response.data);
            setLocations(response.data);
        });
    }, []);

    function getValuesFromLocations() {
        return locations.map((location) => {
            //console.log("location-react-16", location);
            return (
                <option key={location.id} value={location.id}>
                    {location.name}
                </option>
            );
        });
    }

    function handleChange(event) {
        console.log("event.target.value", event.target.value);
        setQuery({
            ...query,
            [event.target.name]: event.target.value,
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        axios.get("/api/search", { params: query }).then((response) => {
            console.log("[response.data-api/search]", response.data);
            setResults(response.data);
        });
        console.log("submitted!");
    }
    function onHelpClick(id) {
        console.log("id", id);
        axios
            .post(`/api/deliveries`, { availability_id: id })
            .then((response) => {
                console.log(response.data);
                alert("Request Sent!");
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

    function showResults() {
        return results.map((result) => {
            return (
                <li key={result.id}>
                    <div>
                        <h3>Name :</h3>
                        <p>{result.first_name}</p>
                    </div>
                    <div>
                        <h3>From :</h3>
                        <p>{result.origin_name}</p>
                    </div>
                    <div>
                        <h3>To :</h3>
                        <p>{result.destination_name}</p>
                    </div>
                    <div>
                        <h3>Size :</h3>
                        <p>{result.size}</p>
                    </div>
                    <div>
                        <h3>Time :</h3>
                        <p>{result.time_slot}</p>
                    </div>
                    <button onClick={() => onHelpClick(result.id)}>
                        Send Request
                    </button>
                </li>
            );
        });
    }

    return (
        <section className="need-help">
            <form onSubmit={handleSubmit}>
                <label>From</label>
                <select name="origin_id" onChange={handleChange} value={1}>
                    {getValuesFromLocations()}
                </select>

                <label>To</label>
                <select name="destination_id" onChange={handleChange} value={2}>
                    {getValuesFromLocations()}
                </select>

                <label>Package-Size</label>
                <select onChange={handleChange} name="size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                </select>

                <label>Time-Slot</label>
                <select onChange={handleChange} name="time_slot">
                    <option value="daily">Daily</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                </select>
                <button type="submit">Search</button>
            </form>

            <div className="results">
                <ul>{showResults()}</ul>
            </div>
        </section>
    );
}

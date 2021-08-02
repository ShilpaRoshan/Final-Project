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
                <li key={result.id} className="search-list-result">
                    <p className="list-name">
                        {result.first_name} {result.last_name}
                    </p>

                    <button
                        onClick={() => onHelpClick(result.id)}
                        className="send-request-button"
                    >
                        Send Request
                    </button>
                </li>
            );
        });
    }

    return (
        <section className="need-help">
            <form onSubmit={handleSubmit} className="help-form">
                <div className="help-form-wrapper">
                    {" "}
                    <div className="help-form-content">
                        <label>From</label>
                        <select
                            name="origin_id"
                            onChange={handleChange}
                            value={query.origin_id}
                            className="location-drop-down"
                        >
                            {getValuesFromLocations()}
                        </select>
                    </div>
                    <div className="help-form-content">
                        <label>To</label>
                        <select
                            name="destination_id"
                            onChange={handleChange}
                            value={query.destination_id}
                            className="location-drop-down"
                        >
                            {getValuesFromLocations()}
                        </select>
                    </div>
                    <div className="help-form-content">
                        <label>Size</label>
                        <select
                            onChange={handleChange}
                            name="size"
                            className="size-drop-down"
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </select>
                    </div>
                    <div className="help-form-content">
                        <label>When</label>
                        <select
                            onChange={handleChange}
                            name="time_slot"
                            className="drop-down"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekend">Weekend</option>
                            <option value="flexible">Flexible</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <div className="results">
                <ul className="search-results">{showResults()}</ul>
            </div>
        </section>
    );
}

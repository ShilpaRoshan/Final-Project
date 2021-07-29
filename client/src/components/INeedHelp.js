import { useState, useEffect } from "react";
import axios from "../axios";
export default function INeedHelp() {
    const [locations, setLocations] = useState([]);
    const [query, setQuery] = useState({});
    // const [results,setResults] = useState()
    useEffect(() => {
        axios.get("/api/locations").then((response) => {
            console.log("[getlocations]", response.data);
            setLocations(response.data);
        });
    }, []);

    function getValuesFromLocations() {
        return locations.map((location) => {
            console.log("location-react-16", location);
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
        });
        console.log("submitted!");
    }

    return (
        <section className="need-help">
            <h1>I need help</h1>
            <form onSubmit={handleSubmit}>
                <label>From</label>
                <select name="origin_id" onChange={handleChange}>
                    {getValuesFromLocations()}
                </select>

                <label>To</label>
                <select name="destination_id" onChange={handleChange}>
                    {getValuesFromLocations()}
                </select>

                <label>Package-Size</label>
                <select onChange={handleChange} name="size">
                    <option value="small">S</option>
                    <option value="medium">M</option>
                    <option value="large">L</option>
                </select>

                <label>Time-Slot</label>
                <select onChange={handleChange} name="time_slot">
                    <option value="daily">Daily</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </section>
    );
}

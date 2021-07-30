import { useState, useEffect } from "react";

import axios from "../axios";
export default function ICanHelp() {
    const [locations, setLocations] = useState([]);
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
    function onHandleSubmit(event) {
        event.preventDefault();
        axios
            .put("/api/user/availability", { params: query })
            .then((response) => {
                console.log("[/api/user/availability]", response.data);
            });
    }
    return (
        <section className="need-help">
            <form onSubmit={onHandleSubmit}>
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
                <button type="submit">Done</button>
            </form>

            <div className="results">
                <ul></ul>
            </div>
        </section>
    );
}

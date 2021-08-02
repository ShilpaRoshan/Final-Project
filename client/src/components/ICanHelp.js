import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "../axios";
export default function ICanHelp() {
    const [locations, setLocations] = useState([]);

    const [data, setData] = useState({
        time_slot: "daily",
        origin_id: 1,
        destination_id: 2,
        size: "S",
    });
    useEffect(() => {
        axios.get("/api/locations").then((response) => {
            //console.log("[getlocations]", response.data);
            setLocations(response.data);
        });
        axios.get("/api/user/availability").then((response) => {
            console.log("/api/user/availability", response.data);
            setData(response.data);
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
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    }
    function onHandleSubmit(event) {
        event.preventDefault();
        axios.put("/api/user/availability", data).then((response) => {
            console.log("[/api/user/availability]", response.data);
            //setData(response.data);
        });
    }
    return (
        <section className="need-help">
            <form
                onSubmit={onHandleSubmit}
                className="help-form help-form-center"
            >
                <div className="help-form-wrapper">
                    <div className="help-form-content">
                        <label>From</label>
                        <select
                            name="origin_id"
                            onChange={handleChange}
                            className="location-drop-down"
                            value={data.origin_id}
                        >
                            {getValuesFromLocations()}
                        </select>
                    </div>

                    <div className="help-form-content">
                        <label>To</label>
                        <select
                            name="destination_id"
                            onChange={handleChange}
                            value={data.destination_id}
                            className="location-drop-down"
                        >
                            {getValuesFromLocations()}
                        </select>
                    </div>

                    <div className="help-form-content">
                        <label>Package-Size</label>
                        <select
                            onChange={handleChange}
                            name="size"
                            className="size-drop-down"
                            value={data.size}
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </select>
                    </div>

                    <div className="help-form-content">
                        <label>Time-Slot</label>
                        <select
                            onChange={handleChange}
                            name="time_slot"
                            className="drop-down"
                            value={data.time_slot}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekend">Weekend</option>
                            <option value="flexible">Flexible</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="search-button">
                    Done
                </button>
            </form>
            <Link to="/incoming-list" className="incoming-list">
                {" "}
                Incoming-request-list
            </Link>
        </section>
    );
}

import { useState, useEffect } from "react";
import axios from "../axios";
export default function INeedHelp() {
    const [locations, setLocations] = useState([]);
    const [value, setValues] = useState("S");
    // const [results,setResults] = useState()
    useEffect(() => {
        axios.get("/api/locations").then((response) => {
            console.log("[getlocations]", response.data);
            setLocations(response.data);
        });
    }, []);

    function getValuesFromLocations() {
        return locations.map((location) => {
            console.log("location", location);
            return (
                <option key={location.id} value={location}>
                    {location}
                </option>
            );
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        // axios.get("/api/search").then((response)=>{
        //     console.log("[/api/search]-react",response.data);
        // })
        console.log("submitted!");
    }

    function selectValuesFromDropDown(event) {
        setValues(event.target.value);
    }

    return (
        <section className="need-help">
            <h1>I need help</h1>
            <form onSubmit={handleSubmit}>
                <label>From</label>
                <select>{getValuesFromLocations}</select>
                <label>To</label>
                <select>{getValuesFromLocations}</select>
                <label>Package-Size</label>
                <select value={value} onChange={selectValuesFromDropDown}>
                    <option value="small">S</option>
                    <option value="medium">M</option>
                    <option value="large">L</option>
                </select>
                <label>Time-Slot</label>
                <select onChange={selectValuesFromDropDown}>
                    <option value="daily">Daily</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </section>
    );
}

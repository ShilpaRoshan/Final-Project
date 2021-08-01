import { useState, useEffect } from "react";
import axios from "../axios";

export default function IncomingList() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        //for the incoming list values
        axios.get("/api/deliveries/incoming").then((response) => {
            console.log("[/api/deliveries/incoming]", response.data);
            setRequests(response.data);
        });
    }, []);

    function showIncomingList() {
        return requests.map((request) => {
            return (
                <li key={request.id}>
                    <h3>Name</h3>
                    <p>
                        {request.first_name} {request.last_name}
                    </p>
                    <button>Accept</button>
                    <button>Reject</button>
                </li>
            );
        });
    }

    return (
        <section>
            <div className="results">
                <ul>{showIncomingList()}</ul>
            </div>
        </section>
    );
}

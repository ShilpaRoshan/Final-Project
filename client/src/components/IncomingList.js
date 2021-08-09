import { useState, useEffect } from "react";
import axios from "../axios";

export default function IncomingList() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        //for the incoming list values
        axios.get("/api/deliveries/incoming").then((response) => {
            console.log("[/api/deliveries/incoming]", response.data);
            const data = response.data;
            setRequests(data);
        });
    }, []);

    function onAcceptClick(request) {
        console.log("[Accept]", request);
        axios
            .put(`/api/deliveries/${request.id}`, { status: "Accepted" })
            .then((response) => {
                const data = [...requests];
                data.find((x) => x.id == request.id).status = "Accepted";
                console.log(data);
                setRequests(data);
            });
    }
    function onRejectClick(request) {
        console.log("[reject]", request);
        axios
            .put(`/api/deliveries/${request.id}`, { status: "Rejected" })
            .then((response) => {
                const data = [...requests];
                data.find((x) => x.id == request.id).status = "Rejected";
                console.log(data);
                setRequests(data);
            });
    }

    function showIncomingList() {
        return requests
            .filter((x) => x.status == "Pending")
            .map((request) => {
                return (
                    <li key={request.id} className="list-value">
                        <h3>Name</h3>
                        <p>
                            {request.first_name} {request.last_name}
                        </p>
                        <div className="buttons-container">
                            <button
                                className="accept-button"
                                onClick={() => onAcceptClick(request)}
                            >
                                Accept
                            </button>

                            <button
                                className="reject-button"
                                onClick={() => onRejectClick(request)}
                            >
                                Reject
                            </button>
                            <button className="contact-button">Contact</button>
                        </div>
                    </li>
                );
            });
    }
    function showAcceptedList() {
        return requests
            .filter((x) => x.status == "Accepted")
            .map((result) => {
                return (
                    <li key={result.id} className="list-accepted">
                        <h3>Name</h3>
                        <h3>
                            {result.first_name}
                            {result.last_name}
                        </h3>
                    </li>
                );
            });
    }

    return (
        <section className="incoming-list-container">
            <div className="incoming-list-results">
                <ul className="list-container">{showIncomingList()}</ul>
            </div>
            <h2 className="header-accepted">Accepted List</h2>
            <div className="accpeted-list">
                <ul className="accepted-list-container">
                    {showAcceptedList()}
                </ul>
            </div>
        </section>
    );
}

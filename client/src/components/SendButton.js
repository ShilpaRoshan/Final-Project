import { useState, useEffect } from "react";
import axios from "../axios";
export default function SendButton({ id }) {
    const [existingStatus, setExistingStatus] = useState(false);
    const [status, setStatus] = useState("Pending");

    useEffect(() => {
        axios.get(`/api/deliveries/${id}`).then((response) => {
            console.log("[/api/deliveries/:id]", response.data);
            if (existingStatus == false) {
                setExistingStatus(false);
                return;
            }
            setExistingStatus(true);
        });
    }, []);

    function onSendClick() {
        if (!existingStatus) {
            axios.post(`/api/deliveries/${id}`).then(() => {
                setExistingStatus(true);
            });
            return;
        }
        if (existingStatus) {
            axios
                .put(`/api/deliveries/${id}`, { status: "Accepted" })
                .then(() => {
                    setStatus("Accepted");
                });
        }
    }
    return (
        <div>
            <button type="submit" onClick={onSendClick}>
                Send
            </button>
        </div>
    );
}

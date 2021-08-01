import { useState } from "react";
import axios from "../axios";

export default function Login() {
    const [data, setData] = useState({});

    function onChange(event) {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    }
    function handleSubmit(event) {
        event.preventDefault();
        axios.post("/api/login", data).then((response) => {
            console.log("[/api/login]", response.data);
            window.location.reload();
        });
    }
    return (
        <section className="login-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    onChange={onChange}
                    required
                    placeholder="E-mail"
                ></input>
                <input
                    type="password"
                    name="password"
                    onChange={onChange}
                    required
                    placeholder="Password"
                ></input>
                <button type="submit">LogIn</button>
            </form>
        </section>
    );
}

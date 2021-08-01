import { BrowserRouter, Route, Link } from "react-router-dom";
import INeedHelp from "./INeedHelp.js";
import ICanHelp from "./ICanHelp";
import Login from "./Login";
// import { useState, useEffect } from "react-redux";
// import axios from "../axios";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <nav>
                        <p className="logo">Holen</p>
                        <ul className="nav-list-container">
                            {/* <li>
                                <Link to="/login">Login</Link>
                            </li> */}
                            <li className="nav-link">
                                <Link
                                    to="/need-help"
                                    className="nav-link-value"
                                >
                                    {" "}
                                    I need Help
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/can-help" className="nav-link-value">
                                    {" "}
                                    I can Help
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                {/* <Route path="/login">
                    <Login></Login>
                </Route> */}
                <Route path="/need-help">
                    <p className="main-content">
                        Holen is a eco-friendly solution to maximise the utility
                        of people on the move. Find people who are moving
                        between destiantions of your choice and you can either
                        send or receive packages through them!
                    </p>
                    <INeedHelp />
                </Route>
                <Route path="/can-help">
                    <h1 className="main-content">I can help</h1>
                    <ICanHelp />
                </Route>
            </div>
        </BrowserRouter>
    );
}

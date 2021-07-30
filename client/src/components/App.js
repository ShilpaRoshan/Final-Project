import { BrowserRouter, Route, Link } from "react-router-dom";
import INeedHelp from "./INeedHelp.js";
import ICanHelp from "./ICanHelp";
// import { useState, useEffect } from "react-redux";
// import axios from "../axios";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/need-help"> I need Help</Link>
                            </li>
                            <li>
                                <Link to="/can-help"> I can Help</Link>
                            </li>
                        </ul>
                    </nav>
                </header>

                <Route path="/need-help">
                    <h1>I need help</h1>
                    <INeedHelp />
                </Route>
                <Route path="/can-help">
                    <h1>I can help</h1>
                    <ICanHelp />
                </Route>
            </div>
        </BrowserRouter>
    );
}

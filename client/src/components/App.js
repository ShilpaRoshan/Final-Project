import { BrowserRouter, Route, Link } from "react-router-dom";
import INeedHelp from "./INeedHelp.js";
// import ICanHelp from "./ICanHelp";
// import { useState, useEffect } from "react-redux";
// import axios from "../axios";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <nav></nav>
                </header>
                <h1>Hello</h1>
                <INeedHelp />

                {/* <Route path="/need-help"></Route> */}
                {/* <Route path="/need-help">
                    <ICanHelp />
                </Route> */}
            </div>
        </BrowserRouter>
    );
}

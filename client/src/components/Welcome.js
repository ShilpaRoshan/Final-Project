import { HashRouter, Route } from "react-router-dom";

import Login from "./Login";

export default function Welcome() {
    return (
        <>
            <h1 className="main-header">delivery</h1>
            <div className="welcome">
                <HashRouter>
                    {/* <Route path="/login">
                        <Login />
                    </Route> */}
                </HashRouter>
            </div>
        </>
    );
}

import ReactDOM from "react-dom";
import axios from "./axios";
import Welcome from "./components/Welcome";

import App from "./components/App";

axios.get("/user/id.json").then((response) => {
    console.log("[userId]", response.data.id);
    //user logged-in
    if (response.data.id) {
        ReactDOM.render(<App />, document.querySelector("main"));
        return;
    }

    // user logged out
    ReactDOM.render(<Welcome />, document.querySelector("main"));
});

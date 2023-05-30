import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./bootstrap.min.css";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

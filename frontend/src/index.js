import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Helmet>
        <html lang="ru" />
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/510/fabric.min.js"></script> */}
      </Helmet>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

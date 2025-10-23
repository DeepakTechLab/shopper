import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import AllRouters from "./Routes";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AllRouters />
    </ThemeProvider>
  </React.StrictMode>
);

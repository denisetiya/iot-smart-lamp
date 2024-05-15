import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import Menu from "./components/Menu.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        {
          window.location.pathname !== "/login" && (
            <div className="absolute bottom-4 right-4">
              <Menu />
            </div>
          )
        }
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

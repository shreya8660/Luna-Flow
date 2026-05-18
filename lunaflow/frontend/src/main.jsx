// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* Toast notifications with pink theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff0f6",
            color: "#be185d",
            border: "1px solid #ffc9e0",
            borderRadius: "16px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#ec4899", secondary: "#fff" },
          },
          error: {
            style: { background: "#fff0f6", color: "#e11d48" },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);

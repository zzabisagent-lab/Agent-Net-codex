import React from "react";
import { createBrowserRouter } from "react-router-dom";

function RootPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "linear-gradient(180deg, rgb(246, 244, 238) 0%, rgb(255, 255, 255) 100%)",
        color: "#1f2937",
        fontFamily:
          '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "640px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9a3412",
          }}
        >
          AgentAgora
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "36px", lineHeight: 1.1 }}>
          M01 project bootstrap
        </h1>
        <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6 }}>
          Frontend routing is wired and ready. Business pages and feature flows
          are intentionally deferred to later modules.
        </p>
      </section>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
]);

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils.jsx";
import Dashboard from "../pages/Dashboard.jsx";

// Mock api client
vi.mock("../api/client", () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

import api from "../api/client";

describe("Dashboard (smoke)", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ id: "u1", name: "Test", email: "t@t.com" }));

    // Mock responses
    api.get.mockImplementation((url) => {
      if (url === "/dashboard/today") {
        return Promise.resolve({ data: { data: { chaosScore: 42, browserTabs: 7, unreadEmails: 10, date: new Date().toISOString() } } });
      }
      if (url === "/dashboard/week") {
        return Promise.resolve({ data: { data: [{ day: "Mon", chaosScore: 10 }, { day: "Tue", chaosScore: 20 }] } });
      }
      if (url === "/dashboard/stats") {
        return Promise.resolve({ data: { data: { maxScore: 80, minScore: 5, avgScore: 22.5 } } });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  it("renders dashboard heading", async () => {
    renderWithProviders(<Dashboard />);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });
});

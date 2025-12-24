import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils.jsx";
import Snapshots from "../pages/Snapshots.jsx";

vi.mock("../api/client", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

import api from "../api/client";

describe("Snapshots (smoke)", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ id: "u1", name: "Test", email: "t@t.com" }));

    api.get.mockResolvedValue({
      data: {
        items: [
          {
            _id: "s1",
            date: new Date().toISOString(),
            chaosScore: 21,
            browserTabs: 5,
            unreadEmails: 10,
            notes: "Quick create from dashboard UI",
          },
        ],
        total: 1,
        page: 1,
        pages: 1,
        limit: 20,
        sort: "-date",
      },
    });
  });

  it("renders snapshots page", async () => {
    renderWithProviders(<Snapshots />, { route: "/snapshots" });

        expect(
           await screen.findByRole("heading", { name: "Snapshots", level: 1 })
           ).toBeInTheDocument();

    expect(await screen.findByText(/Quick create from dashboard UI/i)).toBeInTheDocument();
  });
});

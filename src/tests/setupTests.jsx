import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Fixing Recharts warnings in Vitest/JSDOM ResponsiveContainer needs dimensions
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

afterEach(() => {
  cleanup();
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../auth/AuthContext.jsx";

vi.mock("../api/client", () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from "../api/client";

function Harness() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthed">{String(auth?.isAuthed)}</div>
      <button onClick={() => auth.login("a@a.com", "123456")}>login</button>
      <button onClick={() => auth.register("Ali", "a@a.com", "123456")}>register</button>
      <button onClick={() => auth.logout()}>logout</button>
      <div data-testid="user">{auth?.user?.email || ""}</div>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("handles invalid localStorage user safely", async () => {
    localStorage.setItem("user", "undefined");

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    expect(screen.getByTestId("isAuthed").textContent).toBe("false");
  });

  it("login stores token+user and sets state", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "t1",
        data: { id: "u1", email: "a@a.com", name: "Ali" },
      },
    });

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("login"));

    expect(localStorage.getItem("token")).toBe("t1");
    expect(JSON.parse(localStorage.getItem("user")).email).toBe("a@a.com");
    expect(screen.getByTestId("user").textContent).toBe("a@a.com");
    expect(screen.getByTestId("isAuthed").textContent).toBe("true");
  });

  it("register stores token+user and sets state", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "t2",
        data: { id: "u2", email: "a@a.com", name: "Ali" },
      },
    });

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("register"));

    expect(localStorage.getItem("token")).toBe("t2");
    expect(JSON.parse(localStorage.getItem("user")).id).toBe("u2");
    expect(screen.getByTestId("isAuthed").textContent).toBe("true");
  });

  it("logout clears storage and redirects", async () => {
    localStorage.setItem("token", "t");
    localStorage.setItem("user", JSON.stringify({ id: "u", email: "x@x.com" }));

    const original = window.location;
    delete window.location;
    window.location = { href: "" };

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("logout"));

    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("user")).toBe(null);
    expect(window.location.href).toBe("/login");

    window.location = original;
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal.jsx";

vi.mock("../api/client", () => ({
  default: {
    delete: vi.fn(),
  },
}));
import api from "../api/client";

describe("ConfirmDeleteModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders when open", () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onClose={() => {}}
        snapshot={{ _id: "s1" }}
        onDeleted={() => {}}
      />
    );
    expect(screen.getByText(/Delete snapshot/i)).toBeInTheDocument();
  });

  it("calls api.delete and callbacks on confirm", async () => {
    api.delete.mockResolvedValueOnce({});

    const onClose = vi.fn();
    const onDeleted = vi.fn();

    render(
      <ConfirmDeleteModal
        open={true}
        onClose={onClose}
        snapshot={{ _id: "s1" }}
        onDeleted={onDeleted}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(api.delete).toHaveBeenCalledWith("/snapshots/s1");
    expect(onClose).toHaveBeenCalled();
    expect(onDeleted).toHaveBeenCalled();
  });
});

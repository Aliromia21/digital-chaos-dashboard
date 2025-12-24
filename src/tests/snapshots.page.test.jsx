import { describe, expect, test, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Snapshots from "../pages/Snapshots";
import { renderWithProviders } from "./test-utils.jsx";

vi.mock("../components/SnapshotTable", () => ({
  default: ({ items, loading }) => (
    <div data-testid="snapshot-table">{loading ? "loading" : `${items.length} rows`}</div>
  ),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const getMock = vi.fn();
const postMock = vi.fn();
vi.mock("../api/client", () => ({
  default: {
    get: (...args) => getMock(...args),
    post: (...args) => postMock(...args),
  },
}));

describe("Snapshots page", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    localStorage.clear();
    // AuthProvider reads initial user from localStorage
    localStorage.setItem("user", JSON.stringify({ id: "u1", email: "a@b.com" }));
  });

  test("loads snapshots when user is present", async () => {
    // Snapshots.jsx can trigger more than one load on mount; resolve consistently.
    getMock.mockResolvedValue({ data: { items: [{ _id: "1" }, { _id: "2" }] } });

    renderWithProviders(<Snapshots />, { route: "/snapshots" });

    expect(screen.getByRole("heading", { name: "Snapshots", level: 1 })).toBeInTheDocument();

    await waitFor(() => {
      expect(getMock).toHaveBeenCalled();
    });

    expect(screen.getByTestId("snapshot-table")).toHaveTextContent("2 rows");
  });

  test("shows error card and toast when load fails", async () => {
    const { toast } = await import("react-hot-toast");

    // Snapshots.jsx can call load multiple times on mount; reject both calls deterministically.
    getMock.mockRejectedValue({ response: { data: { message: "Load failed" } } });

    renderWithProviders(<Snapshots />, { route: "/snapshots" });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Load failed");
    });

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // Component renders the error message in the Card body.
    expect(screen.getByText(/load failed|failed to load snapshots/i)).toBeInTheDocument();
  });

  test("quick snapshot posts and then reloads", async () => {
    const user = userEvent.setup();
    const { toast } = await import("react-hot-toast");

    getMock.mockResolvedValue({ data: { items: [] } });
    postMock.mockResolvedValueOnce({ data: { ok: true } });

    renderWithProviders(<Snapshots />, { route: "/snapshots" });

    await waitFor(() => {
      expect(getMock).toHaveBeenCalled();
    });

    await user.click(screen.getByRole("button", { name: /\+ quick snapshot/i }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalled();
      expect(getMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });
});

import { describe, expect, test, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddSnapshotModal from "../components/modals/AddSnapshotModal";

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const postMock = vi.fn();
vi.mock("../../api/client", () => ({
  default: {
    post: (...args) => postMock(...args),
  },
}));

describe("AddSnapshotModal", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  test("does not render when open is false", () => {
    const { container } = render(
      <AddSnapshotModal open={false} onClose={vi.fn()} onCreated={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders form and allows cancel", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AddSnapshotModal open onClose={onClose} onCreated={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /add snapshot/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("shows error toast when api returns error", async () => {
    postMock.mockRejectedValueOnce({ response: { data: { message: "Boom" } } });
    const { toast } = await import("react-hot-toast");

    render(<AddSnapshotModal open onClose={vi.fn()} onCreated={vi.fn()} />);

    const formEl = document.querySelector("form");
    expect(formEl).toBeTruthy();
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

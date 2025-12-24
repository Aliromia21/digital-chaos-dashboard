import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditSnapshotModal from "../components/modals/EditSnapshotModal";

describe("EditSnapshotModal", () => {
  test("does not render when open is false", () => {
    const { container } = render(
      <EditSnapshotModal open={false} onClose={vi.fn()} snapshot={null} onUpdated={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("prefills key fields from snapshot", () => {
    const snapshot = {
      _id: "s1",
      date: "2025-12-19T10:00:00.000Z",
      browserTabs: 5,
      unreadEmails: 10,
      notes: "old note",
    };

    render(
      <EditSnapshotModal open onClose={vi.fn()} snapshot={snapshot} onUpdated={vi.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: /update snapshot/i })
    ).toBeInTheDocument();

    //  query by label text then walk to input.
    
    const browserTabsLabel = screen.getByText(/browser tabs/i);
    const browserTabs = browserTabsLabel.parentElement?.querySelector("input");
    expect(browserTabs).toHaveValue(5);

    const unreadEmailsLabel = screen.getByText(/unread emails/i);
    const unreadEmails = unreadEmailsLabel.parentElement?.querySelector("input");
    expect(unreadEmails).toHaveValue(10);

    const notesLabel = screen.getByText(/^notes$/i);
    const notes = notesLabel.parentElement?.querySelector("textarea");
    expect(notes).toHaveValue("old note");
  });

  test("close/cancel triggers onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <EditSnapshotModal
        open
        onClose={onClose}
        snapshot={{ _id: "s1", date: "2025-12-19T10:00:00.000Z" }}
        onUpdated={vi.fn()}
      />
    );

    // Either top "Close" or bottom "Cancel" are acceptable
    const closeBtn =
      screen.queryByRole("button", { name: /cancel/i }) ||
      screen.queryByRole("button", { name: /^close$/i }) ||
      screen.queryByRole("button", { name: /close modal/i });

    expect(closeBtn).toBeTruthy();
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

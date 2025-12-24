import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SnapshotTable from "../components/SnapshotTable";

describe("SnapshotTable", () => {
  test("renders empty state when not loading and items is empty", () => {
    render(<SnapshotTable items={[]} loading={false} onChanged={() => {}} />);

    expect(screen.getByText(/your snapshots/i)).toBeInTheDocument();
    expect(screen.getByText(/0 items/i)).toBeInTheDocument();
    expect(screen.getByText(/no snapshots yet\./i)).toBeInTheDocument();
  });

  test("shows loading badge and does not show empty state while loading", () => {
    render(<SnapshotTable items={[]} loading={true} onChanged={() => {}} />);

    expect(screen.getByText(/loading\.{3}/i)).toBeInTheDocument();
    expect(screen.queryByText(/no snapshots yet\./i)).not.toBeInTheDocument();
  });

  test("renders a row and opens edit/delete modals via action buttons", async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();

    render(
      <SnapshotTable
        loading={false}
        onChanged={onChanged}
        items={[
          {
            _id: "abc",
            date: "2025-12-19T10:00:00.000Z",
            chaosScore: 21,
            browserTabs: 5,
            unreadEmails: 10,
            notes: "Quick create from dashboard UI",
          },
        ]}
      />
    );

    // Basic row content
    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(/quick create from dashboard ui/i)).toBeInTheDocument();

    // Open Edit modal
    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(
      screen.getByRole("heading", { name: /update snapshot/i })
    ).toBeInTheDocument();

    // Close Edit modal (backdrop)
    await user.click(screen.getAllByLabelText(/close modal/i)[0]);
    expect(
      screen.queryByRole("heading", { name: /update snapshot/i })
    ).not.toBeInTheDocument();

    // Open Delete modal
    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(
      screen.getByRole("heading", { name: /delete snapshot\?/i })
    ).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "./page";

describe("SettingsPage", () => {
  it("renders heading and save button", () => {
    render(<SettingsPage />);
    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("allows toggling the notify checkbox", () => {
    render(<SettingsPage />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});

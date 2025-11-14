import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/contexts/auth", () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

import { Header } from "./logo";

describe("Header", () => {
  it("shows Log in when guest", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  });
});

// Note: Authed menu is conditionally rendered; a focused test would need module reset.

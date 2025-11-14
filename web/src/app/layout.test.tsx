import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock global CSS to prevent JSDOM stylesheet parse errors
vi.mock("./globals.css", () => ({}), { virtual: true });
// Mock next/font/google to avoid runtime in tests
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "" }),
  Geist_Mono: () => ({ variable: "" }),
}));

describe("RootLayout", () => {
  it("renders skip link and main landmark", async () => {
    const { default: RootLayout } = await import("./layout");
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders site header banner", async () => {
    const { default: RootLayout } = await import("./layout");
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

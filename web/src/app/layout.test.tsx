import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders skip link and main landmark", () => {
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders site header banner", () => {
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

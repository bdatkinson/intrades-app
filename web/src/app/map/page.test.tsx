import { render, screen } from "@testing-library/react";
import MapPage from "./page";

describe("MapPage", () => {
  it("renders placeholder message", () => {
    render(<MapPage />);
    expect(screen.getByText(/Map integration coming soon/i)).toBeInTheDocument();
  });

  it("shows env key hint", () => {
    render(<MapPage />);
    expect(screen.getByText(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY/i)).toBeInTheDocument();
  });
});

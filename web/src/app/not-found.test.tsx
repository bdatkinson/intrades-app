import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders accessible heading and links", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse challenges/i })).toBeInTheDocument();
    // Quick links region present
    expect(screen.getByLabelText(/quick links/i)).toBeInTheDocument();
  });
});

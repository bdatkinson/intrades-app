import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders getting started text", () => {
    render(<Home />);
    expect(
      screen.getByText(/To get started, edit the page\.tsx file\./i)
    ).toBeInTheDocument();
  });
});

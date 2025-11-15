import { render, screen } from "@testing-library/react";
import ChallengeDetail from "./page";

describe("ChallengeDetail upload section", () => {
  it("renders Submission section when challenge requires upload", () => {
    render(<ChallengeDetail params={{ id: "2" }} />);
    expect(screen.getByText(/Submission/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload a photo or video/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/challenges",
  useSearchParams: () => ({ get: () => null, toString: () => "" }),
}));

import ChallengesPage from "./page";

describe("ChallengesPage", () => {
  it("renders heading and filters", () => {
    render(<ChallengesPage />);
    expect(screen.getByRole("heading", { name: /challenges/i })).toBeInTheDocument();
    expect(screen.getByText(/trade/i)).toBeInTheDocument();
    expect(screen.getByText(/difficulty/i)).toBeInTheDocument();
  });

  it("updates URL on trade filter change", async () => {
    render(<ChallengesPage />);
    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "Electrical" } });
    expect(push).toHaveBeenCalledWith("/challenges?trade=Electrical");
  });

  it("resets filters", () => {
    render(<ChallengesPage />);
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(push).toHaveBeenCalledWith("/challenges");
  });
});

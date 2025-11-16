import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/challenges",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    getChallenges: vi.fn(() => Promise.resolve([])),
  },
  storage: {
    tokens: null,
  },
}));

import ChallengesPage from "./page";

describe("ChallengesPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("renders heading and filters", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChallengesPage />
      </QueryClientProvider>
    );
    expect(screen.getByRole("heading", { name: /challenges/i })).toBeInTheDocument();
    expect(screen.getByText(/difficulty/i)).toBeInTheDocument();
  });

  it("updates URL on difficulty filter change", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChallengesPage />
      </QueryClientProvider>
    );
    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "Medium" } });
    expect(push).toHaveBeenCalledWith("/challenges?difficulty=Medium");
  });

  it("resets filters", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChallengesPage />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(push).toHaveBeenCalledWith("/challenges");
  });
});

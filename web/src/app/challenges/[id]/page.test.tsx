import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, beforeEach } from "vitest";
import ChallengeDetail from "./page";

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    getChallenge: vi.fn(() => Promise.resolve({
      id: "2",
      title: "Test Challenge",
      description: "Test description",
      trade: "Electrical",
      difficulty: "Easy",
      xpReward: 50,
      submissionType: "upload",
      submissionAccept: "image/*",
    })),
    profile: vi.fn(() => Promise.resolve({ id: "1", name: "Test User", email: "test@example.com" })),
  },
  storage: {
    tokens: { accessToken: "test-token" },
  },
}));

describe("ChallengeDetail upload section", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("renders Submission section when challenge requires upload", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChallengeDetail params={{ id: "2" }} />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Test Challenge/i)).toBeInTheDocument();
    });
    
    // Check for submission form elements
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();
  });
});

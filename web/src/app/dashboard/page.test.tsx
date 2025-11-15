import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { vi, beforeEach } from "vitest"
import Dashboard from "./page"

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    profile: vi.fn(() => Promise.resolve({ id: "1", name: "Test User", email: "test@example.com" })),
    getUserProgression: vi.fn(() => Promise.resolve({
      xp: 500,
      level: 5,
      tier: "Journeyman",
      badges: [],
      nextTierXP: 400,
      streakDays: 5,
    })),
    getBadges: vi.fn(() => Promise.resolve([])),
    getUserBadges: vi.fn(() => Promise.resolve([])),
    getLeaderboard: vi.fn(() => Promise.resolve({ entries: [], period: "weekly" })),
    getActivityFeed: vi.fn(() => Promise.resolve([])),
  },
  storage: {
    tokens: { accessToken: "test-token" },
  },
}));

describe("Dashboard", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("renders title", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    )
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })
})

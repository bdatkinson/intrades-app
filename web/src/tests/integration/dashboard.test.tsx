import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "@/app/dashboard/page";

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    profile: vi.fn(() => Promise.resolve({ id: "1", name: "Test User", email: "test@example.com" })),
    getUserProgression: vi.fn(() =>
      Promise.resolve({
        xp: 500,
        level: 5,
        tier: "Journeyman",
        badges: [],
        nextTierXP: 400,
        streakDays: 5,
      })
    ),
    getBadges: vi.fn(() => Promise.resolve([])),
    getUserBadges: vi.fn(() => Promise.resolve([])),
    getLeaderboard: vi.fn(() =>
      Promise.resolve({
        entries: [],
        period: "weekly",
      })
    ),
    getActivityFeed: vi.fn(() => Promise.resolve([])),
  },
  storage: {
    tokens: { accessToken: "test-token" },
  },
}));

describe("Dashboard Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("renders dashboard with all sections", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    // Check for key sections - use getAllByText since text appears multiple times
    const totalXP = screen.getAllByText(/Total XP/i);
    expect(totalXP.length).toBeGreaterThan(0);
    const level = screen.getAllByText(/Level/i);
    expect(level.length).toBeGreaterThan(0);
    expect(screen.getByText(/Badges Earned/i)).toBeInTheDocument();
  });

  it("displays user progression data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // XP value appears multiple times, so use getAllByText
      const xpValues = screen.getAllByText(/500/);
      expect(xpValues.length).toBeGreaterThan(0);
      // Journeyman appears multiple times (in XP bar and tier display)
      const journeyman = screen.getAllByText(/Journeyman/);
      expect(journeyman.length).toBeGreaterThan(0);
    });
  });

  it("shows loading state initially", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });
});


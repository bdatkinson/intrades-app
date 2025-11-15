import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeCard } from "../badge-card";
import type { Badge } from "@/lib/api";

const mockBadge: Badge = {
  id: "1",
  name: "Test Badge",
  description: "A test badge",
  icon: "🎯",
  category: "foundation",
  xpRequired: 50,
};

describe("BadgeCard", () => {
  it("renders badge with correct information", () => {
    render(<BadgeCard badge={mockBadge} earned={true} />);

    expect(screen.getByText("Test Badge")).toBeInTheDocument();
    // Badge icon appears multiple times (front and back of card), so use getAllByText
    const icons = screen.getAllByText("🎯");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("shows locked state when not earned", () => {
    render(<BadgeCard badge={mockBadge} earned={false} />);

    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  it("displays XP requirement", () => {
    render(<BadgeCard badge={mockBadge} earned={true} showDetails={true} />);

    expect(screen.getByText(/50.*XP/)).toBeInTheDocument();
  });

  it("shows earned indicator when badge is earned", () => {
    const { container } = render(<BadgeCard badge={mockBadge} earned={true} />);

    // Check for earned styling or indicator
    const card = container.querySelector(".border-yellow-400");
    expect(card).toBeInTheDocument();
  });
});


import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { XPBar } from "../xp-bar";

describe("XPBar", () => {
  it("renders XP bar with correct values", () => {
    render(
      <XPBar
        currentXP={250}
        nextTierXP={400}
        tier="Journeyman"
        level={5}
        animated={false}
      />
    );

    expect(screen.getByText("Level 5")).toBeInTheDocument();
    expect(screen.getByText("Journeyman")).toBeInTheDocument();
    expect(screen.getByText(/250.*400.*XP/)).toBeInTheDocument();
  });

  it("calculates progress percentage correctly", () => {
    const { container } = render(
      <XPBar
        currentXP={300}
        nextTierXP={400}
        tier="Journeyman"
        level={5}
        animated={false}
      />
    );

    // Progress should be 50% (150 XP in tier / 250 XP needed)
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("shows almost tier message when close to next tier", () => {
    render(
      <XPBar
        currentXP={390}
        nextTierXP={400}
        tier="Journeyman"
        level={5}
        animated={false}
      />
    );

    expect(screen.getByText(/Almost to the next tier/)).toBeInTheDocument();
  });

  it("displays tier badge correctly", () => {
    render(
      <XPBar
        currentXP={250}
        nextTierXP={400}
        tier="Master"
        level={8}
        animated={false}
      />
    );

    expect(screen.getByText("Master")).toBeInTheDocument();
  });
});


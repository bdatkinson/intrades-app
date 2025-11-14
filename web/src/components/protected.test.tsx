import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("Protected", () => {
  it("redirects when no user", async () => {
    vi.doMock("@/contexts/auth", () => ({ useAuth: () => ({ user: null }) }));
    const { default: Protected } = await import("./protected");
    render(<Protected><div>Secret</div></Protected>);
    expect(replace).toHaveBeenCalled();
  });
});

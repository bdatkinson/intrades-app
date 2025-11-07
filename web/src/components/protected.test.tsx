import { render } from "@testing-library/react";
import Protected from "./protected";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { vi } from "vitest";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/secret",
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>
  );
}

describe("Protected", () => {
  it("redirects to /auth/login when unauthenticated", () => {
    renderWithProviders(
      <Protected>
        <div>Secret</div>
      </Protected>
    );
    expect(replaceMock).toHaveBeenCalledWith(
      "/auth/login?next=%2Fsecret"
    );
  });
});

import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
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

describe("/auth/login page", () => {
  it("renders email and password fields", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^log in$/i })).toBeInTheDocument();
  });
});

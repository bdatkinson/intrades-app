import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

const login = vi.fn().mockResolvedValue(undefined);
vi.mock("@/contexts/auth", () => ({ useAuth: () => ({ login }) }));

import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders heading and button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^log in$/i })).toBeInTheDocument();
  });

  it("validates short password", async () => {
    render(<LoginPage />);
    const email = document.querySelector('input[name="email"]') as HTMLInputElement;
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    fireEvent.input(email, { target: { value: "test@example.com" } });
    fireEvent.input(password, { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByText(/too small/i)).toBeInTheDocument();
  });

  it("submits valid form", async () => {
    render(<LoginPage />);
    const email = document.querySelector('input[name="email"]') as HTMLInputElement;
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    fireEvent.input(email, { target: { value: "ok@example.com" } });
    fireEvent.input(password, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    await (await import("@testing-library/react")).waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
  });
});

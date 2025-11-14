import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

const registerUser = vi.fn().mockResolvedValue(undefined);
vi.mock("@/contexts/auth", () => ({ useAuth: () => ({ register: registerUser }) }));

import RegisterPage from "./page";

describe("RegisterPage", () => {
  it("renders heading and button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("validates short name", async () => {
    render(<RegisterPage />);
    const name = document.querySelector('input[name="name"]') as HTMLInputElement;
    const email = document.querySelector('input[name="email"]') as HTMLInputElement;
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    fireEvent.input(name, { target: { value: "A" } });
    fireEvent.input(email, { target: { value: "a@b.com" } });
    fireEvent.input(password, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/too small/i)).toBeInTheDocument();
  });
});

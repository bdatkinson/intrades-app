import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BreakEvenPage from "./page";

describe("BreakEvenPage", () => {
  it("computes units and revenue", async () => {
    render(<BreakEvenPage />);

    const fixed = document.querySelector('input[name="fixedCosts"]') as HTMLInputElement;
    const variable = document.querySelector('input[name="variablePerUnit"]') as HTMLInputElement;
    const price = document.querySelector('input[name="unitPrice"]') as HTMLInputElement;

    fireEvent.input(fixed, { target: { value: "1000" } });
    fireEvent.input(variable, { target: { value: "25" } });
    fireEvent.input(price, { target: { value: "50" } });

    await waitFor(() => {
      expect(screen.getByText(/Contribution per unit/i).nextSibling?.textContent).toMatch(/25\.00/);
      expect(screen.getByText(/Break-even units/i).nextSibling?.textContent).toMatch(/40/);
      expect(screen.getByText(/Break-even revenue/i).nextSibling?.textContent).toMatch(/2000\.00/);
    });
  });
});

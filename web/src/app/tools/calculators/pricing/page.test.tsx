import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PricingCalculatorPage from "./page";

describe("PricingCalculatorPage", () => {
  it("computes target price and profit", async () => {
    render(<PricingCalculatorPage />);

    const m = document.querySelector('input[name="materials"]') as HTMLInputElement;
    const h = document.querySelector('input[name="hours"]') as HTMLInputElement;
    const r = document.querySelector('input[name="rate"]') as HTMLInputElement;
    const oh = document.querySelector('input[name="overheadPct"]') as HTMLInputElement;
    const mg = document.querySelector('input[name="marginPct"]') as HTMLInputElement;

    fireEvent.input(m, { target: { value: "100" } });
    fireEvent.input(h, { target: { value: "5" } });
    fireEvent.input(r, { target: { value: "20" } });
    fireEvent.input(oh, { target: { value: "10" } });
    fireEvent.input(mg, { target: { value: "30" } });

    await waitFor(() => {
      expect(screen.getByText(/Target price/i).nextSibling?.textContent).toMatch(/314\.2/);
      expect(screen.getByText(/Estimated profit/i).nextSibling?.textContent).toMatch(/94\.2/);
    });
  });
});

import { describe, expect, it } from "vitest";
import { calculateTax } from "./taxCalculations";

describe("calculateTax", () => {
  it.each([
    [30000, 3486, 1394.4],
    [60000, 11432, 3210.6],
    [110000, 33432, 4210.6],
    [150000, 53703, 5010.6],
  ])("matches HMRC 2026/27 figures for £%i", (gross, incomeTax, ni) => {
    const result = calculateTax(gross, 0);
    expect(result.incomeTax).toBeCloseTo(incomeTax, 2);
    expect(result.nationalInsurance).toBeCloseTo(ni, 2);
  });

  it("tapers the Personal Allowance to zero at £125,140", () => {
    expect(calculateTax(100000, 0).personalAllowance).toBe(12570);
    expect(calculateTax(110000, 0).personalAllowance).toBe(7570);
    expect(calculateTax(125140, 0).personalAllowance).toBe(0);
  });

  it.each([
    [0, 0],
    [12569, 0],
    [12570, 28],
    [50269, 28],
    [50270, 42],
    [99999, 42],
    [100000, 62],
    [125139, 62],
    [125140, 47],
  ])("reports a marginal rate including NI at £%i", (gross, rate) => {
    expect(calculateTax(gross, 0).marginalTaxRate).toBe(rate);
  });

  it("uses income after salary sacrifice for the marginal rate", () => {
    expect(calculateTax(105000, 10000).marginalTaxRate).toBe(42);
  });

  it("returns a zero effective rate for zero income", () => {
    expect(calculateTax(0, 0).effectiveTaxRate).toBe(0);
  });
});

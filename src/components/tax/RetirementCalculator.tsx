import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RetirementInputs } from "./retirement/RetirementInputs";
import { RetirementResults } from "./retirement/RetirementResults";
import { RetirementCalculatorProps, CalculationInputs } from "./types/retirement";

export const RetirementCalculator = ({ formatCurrency, pensionContribution }: RetirementCalculatorProps) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    currentAge: 22,
    retirementAge: 65,
    additionalInvestment: 5000,
    investmentGrowth: 7,
    inflation: 2.7,
    employerContribution: 5,
    wageGrowth: 5
  });

  const calculations = useMemo(() => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearsInRetirement = 90 - inputs.retirementAge;
    const realReturn = (1 + inputs.investmentGrowth / 100) / (1 + inputs.inflation / 100) - 1;
    
    let totalSavings = 0;
    let currentSalary = pensionContribution * (100 / 5); // Assuming pension contribution is 5% of salary
    const yearlyData = [];

    // Calculate accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      // Calculate contributions based on current salary
      const yearlyPensionContribution = (currentSalary * 5) / 100; // Employee contribution (5%)
      const yearlyEmployerContribution = (currentSalary * inputs.employerContribution) / 100;
      const yearlyContribution = inputs.additionalInvestment + yearlyPensionContribution + yearlyEmployerContribution;
      
      totalSavings = (totalSavings + yearlyContribution) * (1 + realReturn);
      yearlyData.push({
        age: inputs.currentAge + year,
        savings: Math.round(totalSavings),
      });

      // Increase salary for next year using wage growth rate
      currentSalary *= (1 + inputs.wageGrowth / 100);
    }

    // Calculate sustainable withdrawal rate (4% rule adjusted for real return)
    const sustainableWithdrawalRate = Math.min(0.04, realReturn + 0.02); // Cap at 4%
    const maxYearlyWithdrawal = totalSavings * sustainableWithdrawalRate;

    // Calculate drawdown phase
    let remainingSavings = totalSavings;
    for (let year = 1; year <= yearsInRetirement; year++) {
      const thisYearWithdrawal = Math.min(
        maxYearlyWithdrawal,
        remainingSavings * sustainableWithdrawalRate
      );
      
      remainingSavings = (remainingSavings - thisYearWithdrawal) * (1 + realReturn);
      
      yearlyData.push({
        age: inputs.retirementAge + year,
        savings: Math.round(remainingSavings),
      });
    }

    return {
      totalAtRetirement: totalSavings,
      maxYearlyWithdrawal,
      yearlyData,
    };
  }, [inputs, pensionContribution]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Retirement Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <RetirementInputs inputs={inputs} setInputs={setInputs} />
        <RetirementResults calculations={calculations} formatCurrency={formatCurrency} />
      </div>

      <Separator className="my-8" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Calculator Assumptions</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>Life expectancy is set to 90 years old</li>
          <li>Investment returns are assumed to be constant year over year at the specified rate</li>
          <li>Inflation rate is assumed to be constant</li>
          <li>Uses a modified 4% rule for withdrawal calculations, adjusted based on real returns</li>
          <li>All additional investments and pension contributions are made at the end of each year</li>
          <li>No consideration for state pension or other sources of retirement income</li>
          <li>Tax implications during withdrawal phase are not considered</li>
          <li>Market volatility and sequence of returns risk are not factored in</li>
          <li>Assumes continuous employment and consistent contributions until retirement</li>
          <li>Employer contributions are calculated as a percentage of gross salary</li>
          <li>Salary increases are applied annually at a constant rate</li>
        </ul>
      </div>
    </Card>
  );
};
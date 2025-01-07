export interface RetirementCalculatorProps {
  formatCurrency: (value: number) => string;
  pensionContribution: number;
}

export interface CalculationInputs {
  currentAge: number;
  retirementAge: number;
  additionalInvestment: number;
  investmentGrowth: number;
  inflation: number;
  employerContribution: number;
  wageGrowth: number;
  withdrawalRate: number;
}

export interface YearlyData {
  age: number;
  savings: number;
  pensionPot: number;
  investmentPot: number;
  withdrawal: number;
}

export interface CalculationResults {
  totalAtRetirement: number;
  initialWithdrawal: number;
  finalWithdrawal: number;
  yearlyData: YearlyData[];
}
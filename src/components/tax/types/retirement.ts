export interface RetirementCalculatorProps {
  formatCurrency: (value: number) => string;
}

export interface CalculationInputs {
  currentAge: number;
  retirementAge: number;
  additionalInvestment: number;
  investmentGrowth: number;
  inflation: number;
  employerContribution: number;
  wageGrowth: number;
  salary: number;
  personalContribution: number;
  withdrawalRate: number;
  lumpSum: number;
}

export interface YearlyData {
  age: number;
  pensionPot: number;
  investmentPot: number;
  totalWealth: number;
  monthlyIncome: number;
}

export interface CalculationResults {
  yearlyData: YearlyData[];
}
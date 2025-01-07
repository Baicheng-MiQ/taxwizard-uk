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
  withdrawalRate: number; // Added withdrawal rate
}

export interface YearlyData {
  age: number;
  savings: number;
  withdrawal: number; // Added withdrawal amount
}

export interface CalculationResults {
  totalAtRetirement: number;
  initialWithdrawal: number;
  finalWithdrawal: number;
  yearlyData: YearlyData[];
}
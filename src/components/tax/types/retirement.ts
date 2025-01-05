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
}

export interface YearlyData {
  age: number;
  savings: number;
}

export interface CalculationResults {
  totalAtRetirement: number;
  maxYearlyWithdrawal: number;
  yearlyData: YearlyData[];
}
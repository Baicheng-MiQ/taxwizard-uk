export interface CalculationInputs {
  currentAge: number;
  retirementAge: number;
  salary: number;
  personalContrib: number;
  employerContrib: number;
  salaryGrowth: number;
  investmentGrowth: number;
  additionalInvestment: number;
  inflationRate: number;
  withdrawRate: number;
  lumpSum: number;
}

export interface RetirementCalculatorProps {
  formatCurrency: (value: number) => string;
}

export interface ProjectionData {
  age: number;
  totalWealth: number;
  pensionPot: number;
  investmentPot: number;
  monthlyIncome: number;
}
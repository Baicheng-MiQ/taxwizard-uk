export interface TaxBreakdown {
  takeHomePay: number;
  incomeTax: number;
  nationalInsurance: number;
  totalDeductible: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  totalIncome: number;
  personalAllowance: number;
  basicRate: number;
  higherRate: number;
  additionalRate: number;
}

export const calculateTax = (grossIncome: number, pensionContribution: number): TaxBreakdown => {
  // Constants
  const PERSONAL_ALLOWANCE_THRESHOLD = 100000;
  const PERSONAL_ALLOWANCE_BASE = 12570;
  const BASIC_RATE_THRESHOLD = 50270;
  const HIGHER_RATE_THRESHOLD = 125140;
  
  // Calculate adjusted income after pension
  const adjustedIncome = grossIncome - pensionContribution;
  
  // Calculate Personal Allowance reduction
  let personalAllowance = PERSONAL_ALLOWANCE_BASE;
  if (adjustedIncome > PERSONAL_ALLOWANCE_THRESHOLD) {
    const reduction = Math.floor((adjustedIncome - PERSONAL_ALLOWANCE_THRESHOLD) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE_BASE - reduction);
  }
  
  // Calculate tax bands
  let basicRate = 0;
  let higherRate = 0;
  let additionalRate = 0;
  
  // Basic rate (20%)
  if (adjustedIncome > personalAllowance) {
    basicRate = Math.min(BASIC_RATE_THRESHOLD - personalAllowance, adjustedIncome - personalAllowance) * 0.2;
  }
  
  // Higher rate (40%)
  if (adjustedIncome > BASIC_RATE_THRESHOLD) {
    higherRate = Math.min(HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD, adjustedIncome - BASIC_RATE_THRESHOLD) * 0.4;
  }
  
  // Additional rate (45%)
  if (adjustedIncome > HIGHER_RATE_THRESHOLD) {
    additionalRate = (adjustedIncome - HIGHER_RATE_THRESHOLD) * 0.45;
  }
  
  // Calculate National Insurance
  const NI_THRESHOLD = 12584;
  const NI_UPPER_THRESHOLD = 50268;
  let nationalInsurance = 0;
  
  if (adjustedIncome > NI_THRESHOLD) {
    const upToUpperThreshold = Math.min(adjustedIncome, NI_UPPER_THRESHOLD) - NI_THRESHOLD;
    const aboveUpperThreshold = Math.max(0, adjustedIncome - NI_UPPER_THRESHOLD);
    
    nationalInsurance = (upToUpperThreshold * 0.12) + (aboveUpperThreshold * 0.02);
  }
  
  // Calculate totals
  const incomeTax = basicRate + higherRate + additionalRate;
  const totalDeductible = incomeTax + nationalInsurance + pensionContribution;
  const takeHomePay = grossIncome - totalDeductible;
  
  // Calculate rates
  const effectiveTaxRate = ((incomeTax + nationalInsurance) / grossIncome) * 100;
  
  // Calculate marginal rate
  let marginalTaxRate = 0;
  if (adjustedIncome <= personalAllowance) marginalTaxRate = 0;
  else if (adjustedIncome <= BASIC_RATE_THRESHOLD) marginalTaxRate = 20;
  else if (adjustedIncome <= HIGHER_RATE_THRESHOLD) marginalTaxRate = 40;
  else marginalTaxRate = 45;
  
  return {
    takeHomePay,
    incomeTax,
    nationalInsurance,
    totalDeductible,
    effectiveTaxRate,
    marginalTaxRate,
    totalIncome: grossIncome,
    personalAllowance,
    basicRate,
    higherRate,
    additionalRate
  };
};
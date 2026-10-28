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
  // 2026/27 tax year (England, Wales and Northern Ireland)
  const PERSONAL_ALLOWANCE_THRESHOLD = 100000;
  const PERSONAL_ALLOWANCE_BASE = 12570;
  const BASIC_RATE_THRESHOLD = 50270; // Total income threshold for basic rate
  const HIGHER_RATE_THRESHOLD = 125140;
  const NI_LOWER_THRESHOLD = 12570;
  const NI_UPPER_THRESHOLD = 50270;
  
  // Calculate adjusted income after pension
  const adjustedIncome = grossIncome - pensionContribution;
  
  // Calculate Personal Allowance reduction
  let personalAllowance = PERSONAL_ALLOWANCE_BASE;
  if (adjustedIncome > PERSONAL_ALLOWANCE_THRESHOLD) {
    const reduction = Math.floor((adjustedIncome - PERSONAL_ALLOWANCE_THRESHOLD) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE_BASE - reduction);
  }
  
  // Initialize tax bands
  let basicRate = 0;
  let higherRate = 0;
  let additionalRate = 0;
  
  // Calculate taxable income
  const taxableIncome = adjustedIncome - personalAllowance;
  
  if (taxableIncome > 0) {
    // Basic rate (20%) - from PA up to £50,270
    const basicRateAmount = Math.min(
      37700, // Basic rate band is £37,700
      taxableIncome
    );
    basicRate = basicRateAmount * 0.2;
    
    // Higher rate (40%) - from £50,270 to £125,140
    if (taxableIncome > 37700) {
      const higherRateAmount = Math.min(
        HIGHER_RATE_THRESHOLD - (personalAllowance + 37700),
        taxableIncome - 37700
      );
      higherRate = higherRateAmount * 0.4;
      
      // Additional rate (45%) - above £125,140
      if (adjustedIncome > HIGHER_RATE_THRESHOLD) {
        additionalRate = (adjustedIncome - HIGHER_RATE_THRESHOLD) * 0.45;
      }
    }
  }
  
  // Calculate National Insurance
  let nationalInsurance = 0;
  
  if (adjustedIncome > NI_LOWER_THRESHOLD) {
    // 8% on income between lower and upper threshold
    const niBasicAmount = Math.min(
      NI_UPPER_THRESHOLD - NI_LOWER_THRESHOLD,
      Math.max(0, adjustedIncome - NI_LOWER_THRESHOLD)
    );
    nationalInsurance += niBasicAmount * 0.08;
    
    // 2% on income above upper threshold
    if (adjustedIncome > NI_UPPER_THRESHOLD) {
      const niHigherAmount = adjustedIncome - NI_UPPER_THRESHOLD;
      nationalInsurance += niHigherAmount * 0.02;
    }
  }
  
  // Calculate totals
  const incomeTax = basicRate + higherRate + additionalRate;
  const totalDeductible = incomeTax + nationalInsurance + pensionContribution;
  const takeHomePay = grossIncome - totalDeductible;
  
  // Calculate effective tax rate
  const effectiveTaxRate = grossIncome > 0 ? ((incomeTax + nationalInsurance) / grossIncome) * 100 : 0;
  
  // Income tax + NI on the next £1; 60% income tax while the Personal Allowance is tapered
  let marginalTaxRate = 0;
  if (adjustedIncome < NI_LOWER_THRESHOLD) marginalTaxRate = 0;
  else if (adjustedIncome < BASIC_RATE_THRESHOLD) marginalTaxRate = 28;
  else if (adjustedIncome < PERSONAL_ALLOWANCE_THRESHOLD) marginalTaxRate = 42;
  else if (adjustedIncome < HIGHER_RATE_THRESHOLD) marginalTaxRate = 62;
  else marginalTaxRate = 47;
  
  return {
    takeHomePay,
    incomeTax,
    nationalInsurance,
    totalDeductible,
    effectiveTaxRate,
    marginalTaxRate,
    totalIncome: takeHomePay + pensionContribution,
    personalAllowance,
    basicRate,
    higherRate,
    additionalRate
  };
};
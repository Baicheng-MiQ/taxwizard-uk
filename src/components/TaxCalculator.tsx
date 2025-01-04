import { useState } from "react";
import { calculateTax } from "@/utils/taxCalculations";
import InputSection from "./tax/InputSection";
import SummarySection from "./tax/SummarySection";
import TaxBreakdownChart from "./tax/TaxBreakdownChart";
import TaxBandsChart from "./tax/TaxBandsChart";

const TaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState(35000);
  const [pensionContribution, setPensionContribution] = useState(0);

  const results = calculateTax(grossIncome, pensionContribution);

  const pieData = [
    { name: "Take Home", value: results.takeHomePay },
    { name: "Income Tax", value: results.incomeTax },
    { name: "NI", value: results.nationalInsurance },
    { name: "Pension", value: pensionContribution },
  ];

  const barData = [
    { name: "Personal Allowance", amount: results.personalAllowance, rate: "0%" },
    { name: "Basic Rate", amount: results.basicRate / 0.2, rate: "20%" },
    { name: "Higher Rate", amount: results.higherRate / 0.4, rate: "40%" },
    { name: "Additional Rate", amount: results.additionalRate / 0.45, rate: "45%" },
  ].filter(item => item.amount > 0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">UK Income Tax Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <InputSection
          grossIncome={grossIncome}
          setGrossIncome={setGrossIncome}
          pensionContribution={pensionContribution}
          setPensionContribution={setPensionContribution}
        />
        <SummarySection results={results} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TaxBreakdownChart data={pieData} />
        <TaxBandsChart data={barData} />
      </div>
    </div>
  );
};

export default TaxCalculator;
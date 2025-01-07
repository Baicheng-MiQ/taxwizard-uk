import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { calculateTax } from "@/utils/taxCalculations";
import { BarChartSection } from "./tax/BarChartSection";
import { AreaChartSection } from "./tax/AreaChartSection";
import { IncomeDetailsSection } from "./tax/IncomeDetailsSection";
import { TaxSummarySection } from "./tax/TaxSummarySection";
import { RetirementCalculator } from "./tax/RetirementCalculator";

const TaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState(85000);
  const [pensionPercentage, setPensionPercentage] = useState(0);
  const [maxIncomeRange, setMaxIncomeRange] = useState(200000);

  // Calculate actual pension contribution from percentage
  const pensionContribution = (grossIncome * pensionPercentage) / 100;
  const results = calculateTax(grossIncome, pensionContribution);

  const pieData = [
    { name: "Take Home", value: results.takeHomePay },
    { name: "Income Tax", value: results.incomeTax },
    { name: "NI", value: results.nationalInsurance },
    { name: "Pension", value: pensionContribution },
  ];

  const barData = [
    { 
      name: "Personal Allowance", 
      amount: results.personalAllowance,
      tax: 0,
      rate: "0%" 
    },
    { 
      name: "Basic Rate", 
      amount: results.basicRate / 0.2,
      tax: results.basicRate,
      rate: "20%" 
    },
    { 
      name: "Higher Rate", 
      amount: results.higherRate / 0.4,
      tax: results.higherRate,
      rate: "40%" 
    },
    { 
      name: "Additional Rate", 
      amount: results.additionalRate / 0.45,
      tax: results.additionalRate,
      rate: "45%" 
    },
  ].filter(item => item.amount > 0);

  const areaChartData = useMemo(() => {
    const salaryPoints = Array.from({ length: 1000 }, (_, i) => 
      Math.round((maxIncomeRange / 1000) * i)
    );
    
    if (!salaryPoints.includes(grossIncome) && grossIncome > 0) {
      salaryPoints.push(grossIncome);
      salaryPoints.sort((a, b) => a - b);
    }

    return salaryPoints.map(salary => {
      const actualPension = (salary * pensionPercentage) / 100;
      const tax = calculateTax(salary, actualPension);
      return {
        salary,
        takeHome: tax.takeHomePay,
        incomeTax: tax.incomeTax,
        nationalInsurance: tax.nationalInsurance,
        pension: actualPension,
      };
    });
  }, [grossIncome, pensionPercentage, maxIncomeRange]);

  const COLORS = ["#84cc16", "#475569", "#94a3b8", "#0ea5e9"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  const monthlyTakeHome = results.takeHomePay / 12;
  const weeklyTakeHome = results.takeHomePay / 52;
  const dailyTakeHome = results.takeHomePay / 260;
  const hourlyRate = dailyTakeHome / 8;

  const totalDeductions = results.incomeTax + results.nationalInsurance + pensionContribution;
  const deductionsPercentage = (totalDeductions / grossIncome) * 100;
  
  const taxBreakdown = {
    basic: (results.basicRate / grossIncome) * 100,
    higher: (results.higherRate / grossIncome) * 100,
    additional: (results.additionalRate / grossIncome) * 100
  };

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-1">UK Income Tax Calculator</h1>
      
      <div className="grid md:grid-cols-3 gap-3">
        <div className="min-w-0 w-full">
          <div className="grid grid-rows-[auto_1fr] gap-3 h-full">
            <Card className="p-6">
              <IncomeDetailsSection
                grossIncome={grossIncome}
                pensionPercentage={pensionPercentage}
                setPensionPercentage={setPensionPercentage}
                setGrossIncome={setGrossIncome}
                formatCurrency={formatCurrency}
              />
            </Card>

            <Card className="p-4">
              <BarChartSection 
                barData={barData} 
                formatCurrency={formatCurrency} 
                COLORS={COLORS} 
              />
            </Card>
          </div>
        </div>

        <div className="md:col-span-2">
          <TaxSummarySection 
            results={results}
            pieData={pieData}
            COLORS={COLORS}
            formatCurrency={formatCurrency}
            monthlyTakeHome={monthlyTakeHome}
            weeklyTakeHome={weeklyTakeHome}
            dailyTakeHome={dailyTakeHome}
            hourlyRate={hourlyRate}
            pensionContribution={pensionContribution}
            grossIncome={grossIncome}
            totalDeductions={totalDeductions}
            deductionsPercentage={deductionsPercentage}
            taxBreakdown={taxBreakdown}
          />
        </div>
      </div>

      <Card className="p-6">
        <AreaChartSection 
          areaChartData={areaChartData}
          formatCurrency={formatCurrency}
          COLORS={COLORS}
          grossIncome={grossIncome}
          maxIncomeRange={maxIncomeRange}
          setMaxIncomeRange={setMaxIncomeRange}
        />
      </Card>

      <div className="grid gap-4">
        <div className="col-span-full">
          <RetirementCalculator 
            formatCurrency={formatCurrency}
            pensionContribution={pensionContribution}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
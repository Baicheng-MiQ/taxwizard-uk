import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { calculateTax } from "@/utils/taxCalculations";
import { BarChartSection } from "./tax/BarChartSection";
import { AreaChartSection } from "./tax/AreaChartSection";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { IncomeDetailsSection } from "./tax/IncomeDetailsSection";

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
    // Generate 1000 evenly spaced points for smoother curve
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

  return (
    <div className="container mx-auto p-2 space-y-2">
      <h1 className="text-2xl font-bold text-center mb-2">UK Income Tax Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <IncomeDetailsSection
            grossIncome={grossIncome}
            pensionPercentage={pensionPercentage}
            setPensionPercentage={setPensionPercentage}
            setGrossIncome={setGrossIncome}
            formatCurrency={formatCurrency}
          />

          <BarChartSection 
            barData={barData} 
            formatCurrency={formatCurrency} 
            COLORS={COLORS} 
          />
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-2">
              <div className="p-2 bg-[#84cc16]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Take Home</p>
                <p className="text-xl font-bold">{formatCurrency(results.takeHomePay)}</p>
              </div>
              
              <div className="p-2 bg-[#475569]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Income Tax</p>
                <p className="font-semibold">{formatCurrency(results.incomeTax)}</p>
              </div>
              
              <div className="p-2 bg-[#94a3b8]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">NI</p>
                <p className="font-semibold">{formatCurrency(results.nationalInsurance)}</p>
              </div>
              
              <div className="p-2 bg-[#0ea5e9]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Pension</p>
                <p className="font-semibold">{formatCurrency(pensionContribution)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Effective Rate</p>
                  <p className="font-semibold">{results.effectiveTaxRate.toFixed(1)}%</p>
                </div>
                
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Marginal Rate</p>
                  <p className="font-semibold">{results.marginalTaxRate}%</p>
                </div>
              </div>
            </div>

            <div className="col-span-3 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full">
        <AreaChartSection 
          areaChartData={areaChartData}
          formatCurrency={formatCurrency}
          COLORS={COLORS}
          grossIncome={grossIncome}
          maxIncomeRange={maxIncomeRange}
          setMaxIncomeRange={setMaxIncomeRange}
        />
      </div>
    </div>
  );
};

export default TaxCalculator;
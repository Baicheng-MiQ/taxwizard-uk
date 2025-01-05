import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { calculateTax } from "@/utils/taxCalculations";
import { BarChartSection } from "./tax/BarChartSection";
import { AreaChartSection } from "./tax/AreaChartSection";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { IncomeDetailsSection } from "./tax/IncomeDetailsSection";
import { Separator } from "@/components/ui/separator";

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

  // Additional calculations for insights
  const monthlyTakeHome = results.takeHomePay / 12;
  const weeklyTakeHome = results.takeHomePay / 52;
  const dailyTakeHome = results.takeHomePay / 260; // Assuming 260 working days per year
  const hourlyRate = dailyTakeHome / 8; // Assuming 8-hour workday

  const totalDeductions = results.incomeTax + results.nationalInsurance + pensionContribution;
  const deductionsPercentage = (totalDeductions / grossIncome) * 100;
  
  const taxBreakdown = {
    basic: (results.basicRate / grossIncome) * 100,
    higher: (results.higherRate / grossIncome) * 100,
    additional: (results.additionalRate / grossIncome) * 100
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
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-muted-foreground">Monthly: {formatCurrency(monthlyTakeHome)}</p>
                  <p className="text-xs text-muted-foreground">Weekly: {formatCurrency(weeklyTakeHome)}</p>
                  <p className="text-xs text-muted-foreground">Daily: {formatCurrency(dailyTakeHome)}</p>
                  <p className="text-xs text-muted-foreground">Hourly: {formatCurrency(hourlyRate)}</p>
                </div>
              </div>
              
              <div className="p-2 bg-[#475569]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Income Tax</p>
                <p className="font-semibold">{formatCurrency(results.incomeTax)}</p>
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <p>Basic: {taxBreakdown.basic.toFixed(1)}%</p>
                  <p>Higher: {taxBreakdown.higher.toFixed(1)}%</p>
                  <p>Additional: {taxBreakdown.additional.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="p-2 bg-[#94a3b8]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">NI</p>
                <p className="font-semibold">{formatCurrency(results.nationalInsurance)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((results.nationalInsurance / grossIncome) * 100).toFixed(1)}% of gross income
                </p>
              </div>
              
              <div className="p-2 bg-[#0ea5e9]/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Pension</p>
                <p className="font-semibold">{formatCurrency(pensionContribution)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monthly contribution: {formatCurrency(pensionContribution / 12)}
                </p>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Effective Rate</p>
                  <p className="font-semibold">{results.effectiveTaxRate.toFixed(1)}%</p>
                </div>
                
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Marginal Rate</p>
                  <p className="font-semibold">{results.marginalTaxRate}%</p>
                </div>

                <div className="p-2 bg-muted rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground">Total Deductions</p>
                  <p className="font-semibold">{formatCurrency(totalDeductions)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {deductionsPercentage.toFixed(1)}% of gross income
                  </p>
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

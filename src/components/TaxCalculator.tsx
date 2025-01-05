import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateTax } from "@/utils/taxCalculations";
import { PieChartSection } from "./tax/PieChartSection";
import { BarChartSection } from "./tax/BarChartSection";
import { AreaChartSection } from "./tax/AreaChartSection";

const TaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState(35000);
  const [pensionContribution, setPensionContribution] = useState(0);
  const [maxIncomeRange, setMaxIncomeRange] = useState(200000);

  const results = calculateTax(grossIncome, pensionContribution);

  const COLORS = ["#84cc16", "#475569", "#94a3b8", "#0ea5e9"];

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
    const salaryPoints = Array.from({ length: 40 }, (_, i) => 
      Math.round((maxIncomeRange / 40) * i)
    );

    return salaryPoints.map(salary => {
      const tax = calculateTax(salary, (salary * pensionContribution) / grossIncome);
      return {
        salary,
        takeHome: tax.takeHomePay,
        incomeTax: tax.incomeTax,
        nationalInsurance: tax.nationalInsurance,
        pension: (salary * pensionContribution) / grossIncome,
      };
    });
  }, [grossIncome, pensionContribution, maxIncomeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  return (
    <div className="container mx-auto p-2 space-y-2">
      <h1 className="text-2xl font-bold text-center mb-2">UK Income Tax Calculator</h1>
      
      <div className="grid md:grid-cols-3 gap-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Income Details</h2>
          <div className="space-y-2">
            <div>
              <Label htmlFor="income" className="text-sm">Gross Yearly Income: {formatCurrency(grossIncome)}</Label>
              <Slider
                id="income"
                min={0}
                max={200000}
                step={100}
                value={[grossIncome]}
                onValueChange={(value) => setGrossIncome(value[0])}
                className="my-2"
              />
            </div>
            
            <div>
              <Label htmlFor="pension" className="text-sm">Pension Contribution: {formatCurrency(pensionContribution)}</Label>
              <Slider
                id="pension"
                min={0}
                max={grossIncome}
                step={100}
                value={[pensionContribution]}
                onValueChange={(value) => setPensionContribution(value[0])}
                className="my-2"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="space-y-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS[0]}20` }}>
              <p className="text-xl font-bold" style={{ color: COLORS[0] }}>
                Take Home: {formatCurrency(results.takeHomePay)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS[1]}20` }}>
                <p className="text-xs text-muted-foreground">Income Tax</p>
                <p className="font-semibold" style={{ color: COLORS[1] }}>{formatCurrency(results.incomeTax)}</p>
              </div>
              
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS[2]}20` }}>
                <p className="text-xs text-muted-foreground">NI</p>
                <p className="font-semibold" style={{ color: COLORS[2] }}>{formatCurrency(results.nationalInsurance)}</p>
              </div>
              
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS[3]}20` }}>
                <p className="text-xs text-muted-foreground">Deductions</p>
                <p className="font-semibold" style={{ color: COLORS[3] }}>{formatCurrency(results.totalDeductible)}</p>
              </div>
              
              <div className="p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold">{formatCurrency(results.totalIncome)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 text-sm">
              <div className="flex-1 p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Effective Rate</p>
                <p className="font-semibold">{results.effectiveTaxRate.toFixed(1)}%</p>
              </div>
              
              <div className="flex-1 p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Marginal Rate</p>
                <p className="font-semibold">{results.marginalTaxRate}%</p>
              </div>
            </div>
          </div>
        </Card>

        <PieChartSection 
          pieData={pieData} 
          formatCurrency={formatCurrency} 
          COLORS={COLORS} 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <BarChartSection 
          barData={barData} 
          formatCurrency={formatCurrency} 
          COLORS={COLORS} 
        />
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
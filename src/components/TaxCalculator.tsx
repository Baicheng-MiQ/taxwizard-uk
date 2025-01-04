import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculateTax } from "@/utils/taxCalculations";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  const COLORS = ["#84cc16", "#475569", "#94a3b8", "#0ea5e9"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">UK Income Tax Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Income Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="income">Gross Yearly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">£</span>
                <Input
                  id="income"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="pl-6"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="pension">Pension Contribution: {formatCurrency(pensionContribution)}</Label>
              <Slider
                id="pension"
                min={0}
                max={grossIncome}
                step={100}
                value={[pensionContribution]}
                onValueChange={(value) => setPensionContribution(value[0])}
                className="my-4"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-secondary">
              Take Home Pay: {formatCurrency(results.takeHomePay)}
            </p>
            <p>Income Tax: {formatCurrency(results.incomeTax)}</p>
            <p>National Insurance: {formatCurrency(results.nationalInsurance)}</p>
            <p>Total Deductions: {formatCurrency(results.totalDeductible)}</p>
            <p>Effective Tax Rate: {results.effectiveTaxRate.toFixed(1)}%</p>
            <p>Marginal Tax Rate: {results.marginalTaxRate}%</p>
            <p>Total Income: {formatCurrency(results.totalIncome)}</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Income Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tax Bands</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="amount" fill="#475569">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaxCalculator;
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

  // Updated colors for better visual appeal
  const COLORS = ["#8B5CF6", "#0EA5E9", "#F97316", "#10B981"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.5; // Increased radius for better label spacing
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Calculate percentage
    const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((value / total) * 100).toFixed(1);

    return (
      <g>
        {/* Draw line from pie to label */}
        <line
          x1={cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN)}
          y1={cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN)}
          x2={x}
          y2={y}
          stroke={COLORS[index % COLORS.length]}
          strokeWidth={2}
        />
        {/* Draw label background */}
        <rect
          x={x + (x > cx ? 5 : -105)}
          y={y - 12}
          width={100}
          height={24}
          fill="white"
          rx={4}
        />
        {/* Draw label text */}
        <text
          x={x + (x > cx ? 10 : -100)}
          y={y}
          fill={COLORS[index % COLORS.length]}
          className="text-xs font-medium"
          dominantBaseline="central"
        >
          {`${name}: ${percentage}%`}
        </text>
      </g>
    );
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
          <div className="h-[500px]"> {/* Increased height for better spacing */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  outerRadius={140}
                  innerRadius={70} // Added innerRadius for donut chart
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tax Bands</h2>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Bar dataKey="amount" fill="#475569">
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={1}
                    />
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
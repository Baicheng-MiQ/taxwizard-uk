import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RetirementCalculatorProps {
  formatCurrency: (value: number) => string;
  pensionContribution: number;
}

export const RetirementCalculator = ({ formatCurrency, pensionContribution }: RetirementCalculatorProps) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [additionalInvestment, setAdditionalInvestment] = useState(5000);
  const [investmentGrowth, setInvestmentGrowth] = useState(7);
  const [inflation, setInflation] = useState(2.7);

  const handleInvestmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const rawValue = event.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = rawValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Convert to number and update state
    const numericValue = parseFloat(sanitizedValue) || 0;
    setAdditionalInvestment(numericValue);
  };

  const calculations = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = 90 - retirementAge;
    const realReturn = (1 + investmentGrowth / 100) / (1 + inflation / 100) - 1;
    
    let totalSavings = 0;
    const yearlyData = [];
    const yearlyContribution = additionalInvestment + pensionContribution;

    // Calculate accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      totalSavings = (totalSavings + yearlyContribution) * (1 + realReturn);
      yearlyData.push({
        age: currentAge + year,
        savings: Math.round(totalSavings),
      });
    }

    // Calculate sustainable withdrawal rate (4% rule adjusted for real return)
    // This ensures we don't deplete the principal too quickly
    const sustainableWithdrawalRate = Math.min(0.04, realReturn + 0.02); // Cap at 4%
    const maxYearlyWithdrawal = totalSavings * sustainableWithdrawalRate;

    // Calculate drawdown phase with dynamic withdrawals
    let remainingSavings = totalSavings;
    for (let year = 1; year <= yearsInRetirement; year++) {
      // Calculate this year's withdrawal (adjusted for inflation)
      const thisYearWithdrawal = Math.min(
        maxYearlyWithdrawal,
        remainingSavings * sustainableWithdrawalRate
      );
      
      // Update remaining savings
      remainingSavings = (remainingSavings - thisYearWithdrawal) * (1 + realReturn);
      
      yearlyData.push({
        age: retirementAge + year,
        savings: Math.round(remainingSavings),
      });
    }

    return {
      totalAtRetirement: totalSavings,
      maxYearlyWithdrawal,
      yearlyData,
    };
  }, [currentAge, retirementAge, additionalInvestment, investmentGrowth, inflation, pensionContribution]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Retirement Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="current-age">Current Age: {currentAge}</Label>
            <Slider
              id="current-age"
              min={18}
              max={80}
              step={1}
              value={[currentAge]}
              onValueChange={(value) => setCurrentAge(value[0])}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="retirement-age">Retirement Age: {retirementAge}</Label>
            <Slider
              id="retirement-age"
              min={currentAge + 1}
              max={85}
              step={1}
              value={[retirementAge]}
              onValueChange={(value) => setRetirementAge(value[0])}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="additional-investment">
              Additional Yearly Investment (besides pension)
            </Label>
            <Input
              id="additional-investment"
              type="text"
              value={additionalInvestment.toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
              onChange={handleInvestmentChange}
              className="text-right"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="investment-growth">
              Expected Investment Growth: {investmentGrowth}%
            </Label>
            <Slider
              id="investment-growth"
              min={1}
              max={15}
              step={0.1}
              value={[investmentGrowth]}
              onValueChange={(value) => setInvestmentGrowth(value[0])}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="inflation">Expected Inflation: {inflation}%</Label>
            <Slider
              id="inflation"
              min={0}
              max={10}
              step={0.1}
              value={[inflation]}
              onValueChange={(value) => setInflation(value[0])}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/5 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Expected Savings at Retirement</h3>
              <p className="text-3xl font-bold text-secondary">
                {formatCurrency(calculations.totalAtRetirement)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Sustainable Yearly Withdrawal</h3>
              <p className="text-2xl font-semibold text-secondary">
                {formatCurrency(calculations.maxYearlyWithdrawal)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                (Until age 90, adjusted for inflation)
              </p>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={calculations.yearlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age', position: 'bottom' }}
                />
                <YAxis 
                  tickFormatter={(value) => `£${(value / 1000000).toFixed(1)}M`}
                  label={{ value: 'Savings', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#00703C"
                  fill="#00703C"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
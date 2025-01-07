import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalculationResults } from '../types/retirement';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RetirementResultsProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

export const RetirementResults = ({ calculations, formatCurrency }: RetirementResultsProps) => {
  const [visibleLines, setVisibleLines] = useState({
    totalSavings: true,
    pension: false,
    investments: false,
    withdrawals: true
  });

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/5 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Expected Savings at Retirement</h3>
          <p className="text-3xl font-bold text-secondary">
            {formatCurrency(calculations.totalAtRetirement)}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Withdrawal Range</h3>
          <p className="text-2xl font-semibold text-secondary">
            {formatCurrency(calculations.initialWithdrawal)} - {formatCurrency(calculations.finalWithdrawal)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            (Per year, adjusted for growth)
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full mt-8">
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
              label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Age: ${label}`}
            />
            {visibleLines.totalSavings && (
              <Area
                type="monotone"
                dataKey="savings"
                name="Total Savings"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            )}
            {visibleLines.pension && (
              <Area
                type="monotone"
                dataKey="pensionPot"
                name="Pension"
                stroke="#00703C"
                fill="#00703C"
                fillOpacity={0.2}
              />
            )}
            {visibleLines.investments && (
              <Area
                type="monotone"
                dataKey="investmentPot"
                name="Investments"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.2}
              />
            )}
            {visibleLines.withdrawals && (
              <Area
                type="monotone"
                dataKey="withdrawal"
                name="Annual Withdrawal"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="totalSavings" 
            checked={visibleLines.totalSavings}
            onCheckedChange={() => toggleLine('totalSavings')}
          />
          <Label htmlFor="totalSavings" className="text-sm font-medium flex items-center gap-2">
            <div className="w-3 h-3 bg-[#6366f1] rounded-full"></div>
            Total Savings
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pension" 
            checked={visibleLines.pension}
            onCheckedChange={() => toggleLine('pension')}
          />
          <Label htmlFor="pension" className="text-sm font-medium flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00703C] rounded-full"></div>
            Pension
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="investments" 
            checked={visibleLines.investments}
            onCheckedChange={() => toggleLine('investments')}
          />
          <Label htmlFor="investments" className="text-sm font-medium flex items-center gap-2">
            <div className="w-3 h-3 bg-[#2563eb] rounded-full"></div>
            Investments
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="withdrawals" 
            checked={visibleLines.withdrawals}
            onCheckedChange={() => toggleLine('withdrawals')}
          />
          <Label htmlFor="withdrawals" className="text-sm font-medium flex items-center gap-2">
            <div className="w-3 h-3 bg-[#dc2626] rounded-full"></div>
            Annual Withdrawal
          </Label>
        </div>
      </div>
    </div>
  );
};
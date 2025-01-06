import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalculationResults } from '../types/retirement';

interface RetirementResultsProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

export const RetirementResults = ({ calculations, formatCurrency }: RetirementResultsProps) => {
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
  );
};
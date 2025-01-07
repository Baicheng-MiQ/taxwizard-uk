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
          <h3 className="text-lg font-medium mb-2">Withdrawal Range</h3>
          <p className="text-2xl font-semibold text-secondary">
            {formatCurrency(calculations.initialWithdrawal)} - {formatCurrency(calculations.finalWithdrawal)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            (Per year, adjusted for growth)
          </p>
        </div>
      </div>

      <div className="h-[600px] w-full mt-8"> {/* Increased height from 400px to 600px */}
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
            <Area
              type="monotone"
              dataKey="savings"
              name="Total Savings"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="pensionPot"
              name="Pension"
              stroke="#00703C"
              fill="#00703C"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="investmentPot"
              name="Investments"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="withdrawal"
              name="Annual Withdrawal"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
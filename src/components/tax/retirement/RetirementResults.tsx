import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalculationResults } from '../types/retirement';

interface RetirementResultsProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

export const RetirementResults = ({ calculations, formatCurrency }: RetirementResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <h3 className="text-lg font-medium mb-4">Wealth Projection</h3>
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
              label={{ value: 'Wealth', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Age: ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="pensionPot"
              name="Pension"
              stackId="1"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="investmentPot"
              name="Investments"
              stackId="1"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[300px]">
        <h3 className="text-lg font-medium mb-4">Monthly Income in Retirement</h3>
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
              tickFormatter={(value) => formatCurrency(value)}
              label={{ value: 'Monthly Income', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Age: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="monthlyIncome"
              name="Monthly Income"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
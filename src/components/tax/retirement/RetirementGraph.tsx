import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalculationResults } from '../types/retirement';

interface RetirementGraphProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

export const RetirementGraph = ({ calculations, formatCurrency }: RetirementGraphProps) => {
  return (
    <div className="h-[600px] w-full">
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
          <Legend 
            verticalAlign="bottom" 
            height={36}
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
  );
};
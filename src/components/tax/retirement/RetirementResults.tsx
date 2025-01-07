import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectionData } from '../types/retirement';

interface RetirementResultsProps {
  projectionData: ProjectionData[];
  formatCurrency: (value: number) => string;
}

export const RetirementResults = ({ projectionData, formatCurrency }: RetirementResultsProps) => {
  return (
    <div className="space-y-8">
      <div className="h-96">
        <CardTitle className="text-lg mb-4">Net Worth Projection</CardTitle>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Age', position: 'bottom' }} 
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              label={{ 
                value: 'Net Worth (Present Value)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number)]}
              labelFormatter={(value) => `Age: ${value}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              name="Pension"
              dataKey="pensionPot" 
              stroke="#2563eb" 
              dot={false}
            />
            <Line 
              type="monotone" 
              name="Investments"
              dataKey="investmentPot" 
              stroke="#16a34a" 
              dot={false}
            />
            <Line 
              type="monotone" 
              name="Total"
              dataKey="totalWealth" 
              stroke="#dc2626" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-96">
        <CardTitle className="text-lg mb-4">Monthly Income in Retirement</CardTitle>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Age', position: 'bottom' }} 
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              label={{ 
                value: 'Monthly Income (Present Value)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Monthly Income']}
              labelFormatter={(value) => `Age: ${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="monthlyIncome" 
              stroke="#2563eb" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface BarChartSectionProps {
  barData: Array<{
    name: string;
    amount: number;
    tax: number;
    rate: string;
  }>;
  formatCurrency: (value: number) => string;
  COLORS: string[];
}

export const BarChartSection = ({ barData, formatCurrency, COLORS }: BarChartSectionProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Tax Bands</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis width={60} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "amount") return formatCurrency(Number(value));
                if (name === "tax") return formatCurrency(Number(value));
                return value;
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="amount" stackId="a" fill="#e2e8f0" name="Income">
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.3} />
              ))}
            </Bar>
            <Bar dataKey="tax" stackId="a" fill="#475569" name="Tax">
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
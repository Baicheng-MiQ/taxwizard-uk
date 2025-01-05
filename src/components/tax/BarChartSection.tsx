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
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax Bands</h2>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4B5563', fontSize: 12 }}
            />
            <YAxis 
              width={80}
              tick={{ fill: '#4B5563', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value).split('.')[0]}
            />
            <Tooltip 
              formatter={(value, name, entry) => {
                if (name === "amount") return [formatCurrency(Number(value)), "Income"];
                if (name === "tax") return [formatCurrency(Number(value)), "Tax"];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const rate = payload[0].payload.rate;
                  return (
                    <div className="font-semibold mb-1">
                      <div>{label}</div>
                      <div className="text-green-500 text-sm">Tax Rate: {rate}</div>
                    </div>
                  );
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              itemStyle={{
                color: '#374151',
                padding: '4px 0'
              }}
              labelStyle={{
                color: '#111827',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}
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
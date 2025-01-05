import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

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
    <div className="h-full flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Tax Bands</h2>
      <div className="flex-1 min-w-0">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={barData}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              width={60}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
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
                    <div className="font-medium">
                      <div className="text-xs">{label}</div>
                      <div className="text-secondary text-xs">Tax Rate: {rate}</div>
                    </div>
                  );
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: '#1A1F2C',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.75rem'
              }}
              itemStyle={{
                color: '#FFFFFF',
                padding: '2px 0',
                fontSize: '0.75rem'
              }}
              labelStyle={{
                color: '#FFFFFF',
                marginBottom: '0.25rem',
                fontSize: '0.75rem'
              }}
              wrapperStyle={{
                outline: 'none'
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
    </div>
  );
};
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface PieChartSectionProps {
  pieData: Array<{ name: string; value: number }>;
  formatCurrency: (value: number) => string;
  COLORS: string[];
}

export const PieChartSection = ({ pieData, formatCurrency, COLORS }: PieChartSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Income Breakdown</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/formatters";

interface TaxBandsChartProps {
  data: Array<{
    name: string;
    amount: number;
    rate: string;
  }>;
}

const COLORS = ["#8B5CF6", "#0EA5E9", "#F97316", "#10B981"];

const TaxBandsChart = ({ data }: TaxBandsChartProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tax Bands</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Bar dataKey="amount" fill="#475569">
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TaxBandsChart;
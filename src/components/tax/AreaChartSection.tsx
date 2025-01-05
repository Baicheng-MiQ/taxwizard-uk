import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface AreaChartSectionProps {
  areaChartData: Array<{
    salary: number;
    takeHome: number;
    incomeTax: number;
    nationalInsurance: number;
    pension: number;
  }>;
  formatCurrency: (value: number) => string;
  COLORS: string[];
  grossIncome: number;
  maxIncomeRange: number;
  setMaxIncomeRange: (value: number) => void;
}

export const AreaChartSection = ({ 
  areaChartData, 
  formatCurrency, 
  COLORS, 
  grossIncome,
  maxIncomeRange,
  setMaxIncomeRange
}: AreaChartSectionProps) => {
  const validGrossIncome = isFinite(grossIncome) ? 
    Math.min(Math.max(0, grossIncome), maxIncomeRange) : 
    0;

  // Calculate more tick values for better precision
  const tickValues = Array.from({ length: 9 }, (_, i) => (maxIncomeRange * i) / 8);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Income Projection</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={areaChartData}
            margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
          >
            <XAxis 
              dataKey="salary" 
              tickFormatter={(value) => formatCurrency(value)}
              domain={[0, maxIncomeRange]}
              ticks={tickValues}
              allowDataOverflow={true}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              domain={[0, maxIncomeRange]}
              allowDataOverflow={true}
              width={60}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <Tooltip 
              formatter={(value, name) => formatCurrency(Number(value))}
              labelFormatter={(value) => `Gross Income: ${formatCurrency(Number(value))}`}
            />
            {validGrossIncome > 0 && Number.isFinite(validGrossIncome) && (
              <ReferenceLine
                x={validGrossIncome}
                stroke="#ef4444"
                strokeWidth={2}
                label={{
                  value: "Current",
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 10
                }}
                isFront={true}
              />
            )}
            <Area
              type="monotone"
              dataKey="takeHome"
              stackId="1"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              name="Take Home"
            />
            <Area
              type="monotone"
              dataKey="incomeTax"
              stackId="1"
              stroke={COLORS[1]}
              fill={COLORS[1]}
              name="Income Tax"
            />
            <Area
              type="monotone"
              dataKey="nationalInsurance"
              stackId="1"
              stroke={COLORS[2]}
              fill={COLORS[2]}
              name="NI"
            />
            <Area
              type="monotone"
              dataKey="pension"
              stackId="1"
              stroke={COLORS[3]}
              fill={COLORS[3]}
              name="Pension"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <Slider
          min={50000}
          max={200000}
          step={10000}
          value={[maxIncomeRange]}
          onValueChange={(value) => setMaxIncomeRange(value[0])}
          className="my-2"
        />
      </div>
    </Card>
  );
};
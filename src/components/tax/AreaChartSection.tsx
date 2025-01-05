import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  return (
    <Card className="p-3">
      <h2 className="text-base font-semibold mb-2">Income Projection</h2>
      <div className="mb-2">
        <Label className="text-sm truncate">Maximum Income Range: {formatCurrency(maxIncomeRange)}</Label>
        <Slider
          min={50000}
          max={200000}
          step={10000}
          value={[maxIncomeRange]}
          onValueChange={(value) => setMaxIncomeRange(value[0])}
          className="my-1"
        />
      </div>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={areaChartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis 
              dataKey="salary" 
              tickFormatter={(value) => `£${value/1000}k`}
              domain={[0, maxIncomeRange]}
              ticks={[0, maxIncomeRange/4, maxIncomeRange/2, (maxIncomeRange*3)/4, maxIncomeRange]}
              allowDataOverflow={true}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={(value) => `£${value/1000}k`}
              domain={[0, maxIncomeRange]}
              allowDataOverflow={true}
              width={50}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              formatter={(value, name) => formatCurrency(Number(value))}
              labelFormatter={(value) => `Gross Income: ${formatCurrency(Number(value))}`}
            />
            <ReferenceLine
              x={grossIncome}
              stroke="#ef4444"
              strokeWidth={2}
              label={{
                value: "Current",
                position: "top",
                fill: "#ef4444",
                fontSize: 10
              }}
              isFront={true}
              ifOverflow="extendDomain"
            />
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
    </Card>
  );
};
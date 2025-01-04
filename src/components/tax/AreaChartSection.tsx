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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Income Projection</h2>
      <div className="mb-6">
        <Label>Maximum Income Range: {formatCurrency(maxIncomeRange)}</Label>
        <Slider
          min={50000}
          max={200000}
          step={10000}
          value={[maxIncomeRange]}
          onValueChange={(value) => setMaxIncomeRange(value[0])}
          className="my-4"
        />
      </div>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={areaChartData}
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorTakeHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorIncomeTax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorNI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorPension" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="salary" 
              tickFormatter={(value) => formatCurrency(value)}
              domain={[0, maxIncomeRange]}
              ticks={[0, maxIncomeRange/4, maxIncomeRange/2, (maxIncomeRange*3)/4, maxIncomeRange]}
              allowDataOverflow={true}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              domain={[0, maxIncomeRange]}
              allowDataOverflow={true}
              width={75}
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
                value: "Current Income",
                position: "top",
                fill: "#ef4444",
                fontSize: 12
              }}
              isFront={true}
              ifOverflow="extendDomain"
              z={1000}
            />
            <Area
              type="monotone"
              dataKey="pension"
              stackId="1"
              stroke={COLORS[3]}
              fill="url(#colorPension)"
              name="Pension"
            />
            <Area
              type="monotone"
              dataKey="nationalInsurance"
              stackId="1"
              stroke={COLORS[2]}
              fill="url(#colorNI)"
              name="NI"
            />
            <Area
              type="monotone"
              dataKey="incomeTax"
              stackId="1"
              stroke={COLORS[1]}
              fill="url(#colorIncomeTax)"
              name="Income Tax"
            />
            <Area
              type="monotone"
              dataKey="takeHome"
              stackId="1"
              stroke={COLORS[0]}
              fill="url(#colorTakeHome)"
              name="Take Home"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
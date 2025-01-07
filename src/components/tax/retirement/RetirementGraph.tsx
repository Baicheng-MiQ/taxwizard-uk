import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalculationResults } from '../types/retirement';

interface RetirementGraphProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

interface DataSeries {
  id: string;
  name: string;
  dataKey: string;
  color: string;
  defaultVisible: boolean;
}

export const RetirementGraph = ({ calculations, formatCurrency }: RetirementGraphProps) => {
  const dataSeries: DataSeries[] = [
    { id: "savings", name: "Total Savings", dataKey: "savings", color: "#6366f1", defaultVisible: true },
    { id: "pension", name: "Pension", dataKey: "pensionPot", color: "#00703C", defaultVisible: false },
    { id: "investments", name: "Investments", dataKey: "investmentPot", color: "#2563eb", defaultVisible: false },
    { id: "withdrawal", name: "Annual Withdrawal", dataKey: "withdrawal", color: "#dc2626", defaultVisible: true }
  ];

  const [visibleSeries, setVisibleSeries] = useState<string[]>(
    dataSeries.filter(series => series.defaultVisible).map(series => series.id)
  );

  const toggleSeries = (seriesId: string) => {
    setVisibleSeries(prev => 
      prev.includes(seriesId) 
        ? prev.filter(id => id !== seriesId)
        : [...prev, seriesId]
    );
  };

  // Function to format Y-axis values
  const formatYAxis = (value: number) => {
    if (value === 0) return '£0';
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {dataSeries.map((series) => (
          <div key={series.id} className="flex items-center space-x-2">
            <Checkbox 
              id={series.id}
              checked={visibleSeries.includes(series.id)}
              onCheckedChange={() => toggleSeries(series.id)}
            />
            <Label 
              htmlFor={series.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: series.color }} 
              />
              {series.name}
            </Label>
          </div>
        ))}
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={calculations.yearlyData}
            margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ 
                value: 'Age', 
                position: 'insideBottom', 
                offset: -10 
              }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              label={{ 
                value: 'Amount', 
                angle: -90, 
                position: 'insideLeft',
                offset: -20
              }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Age: ${label}`}
            />
            
            {dataSeries.map((series) => (
              visibleSeries.includes(series.id) && (
                <Area
                  key={series.id}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color}
                  fill={series.color}
                  fillOpacity={0.2}
                  strokeWidth={series.id === "savings" ? 2 : 1}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { CalculationResults, CalculationInputs } from '../types/retirement';
import { useState } from 'react';

interface RetirementResultsProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

export const RetirementResults = ({ calculations, formatCurrency, inputs, setInputs }: RetirementResultsProps) => {
  const [isDragging, setIsDragging] = useState<'current' | 'retirement' | null>(null);

  const handleMouseMove = (e: any) => {
    if (!isDragging || !e?.activeLabel) return;
    
    const age = Math.min(Math.max(Number(e.activeLabel), 18), 85);
    
    if (isDragging === 'current') {
      if (age < inputs.retirementAge) {
        setInputs({ ...inputs, currentAge: age });
      }
    } else if (isDragging === 'retirement') {
      if (age > inputs.currentAge) {
        setInputs({ ...inputs, retirementAge: age });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/5 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Expected Savings at Retirement</h3>
          <p className="text-3xl font-bold text-secondary">
            {formatCurrency(calculations.totalAtRetirement)}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Withdrawal Range</h3>
          <p className="text-2xl font-semibold text-secondary">
            {formatCurrency(calculations.initialWithdrawal)} - {formatCurrency(calculations.finalWithdrawal)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            (Per year, adjusted for growth)
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full mt-8">
        <div className="mb-2 text-sm text-muted-foreground">
          Click and drag the highlighted areas to adjust current age ({inputs.currentAge}) and retirement age ({inputs.retirementAge})
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={calculations.yearlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Age', position: 'bottom' }}
            />
            <YAxis 
              tickFormatter={(value) => `£${(value / 1000000).toFixed(1)}M`}
              label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Age: ${label}`}
            />
            <ReferenceArea
              x1={inputs.currentAge - 1}
              x2={inputs.currentAge + 1}
              fill="#2563eb"
              fillOpacity={0.3}
              onMouseDown={() => setIsDragging('current')}
              style={{ cursor: 'ew-resize' }}
            />
            <ReferenceArea
              x1={inputs.retirementAge - 1}
              x2={inputs.retirementAge + 1}
              fill="#dc2626"
              fillOpacity={0.3}
              onMouseDown={() => setIsDragging('retirement')}
              style={{ cursor: 'ew-resize' }}
            />
            <Area
              type="monotone"
              dataKey="pensionPot"
              name="Pension"
              stroke="#00703C"
              fill="#00703C"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="investmentPot"
              name="Investments"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="withdrawal"
              name="Annual Withdrawal"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
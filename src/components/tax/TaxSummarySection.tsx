import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface TaxSummarySectionProps {
  results: {
    takeHomePay: number;
    incomeTax: number;
    nationalInsurance: number;
    effectiveTaxRate: number;
    marginalTaxRate: number;
    basicRate: number;
    higherRate: number;
    additionalRate: number;
  };
  pieData: Array<{ name: string; value: number }>;
  COLORS: string[];
  formatCurrency: (value: number) => string;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
  dailyTakeHome: number;
  hourlyRate: number;
  pensionContribution: number;
  grossIncome: number;
  totalDeductions: number;
  deductionsPercentage: number;
  taxBreakdown: {
    basic: number;
    higher: number;
    additional: number;
  };
}

export const TaxSummarySection = ({
  results,
  pieData,
  COLORS,
  formatCurrency,
  monthlyTakeHome,
  weeklyTakeHome,
  dailyTakeHome,
  hourlyRate,
  pensionContribution,
  grossIncome,
  totalDeductions,
  deductionsPercentage,
  taxBreakdown,
}: TaxSummarySectionProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 space-y-2">
            <div className="p-2 bg-[#84cc16]/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Take Home</p>
              <p className="text-xl font-bold">{formatCurrency(results.takeHomePay)}</p>
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-muted-foreground">Monthly: {formatCurrency(monthlyTakeHome)}</p>
                <p className="text-xs text-muted-foreground">Weekly: {formatCurrency(weeklyTakeHome)}</p>
                <p className="text-xs text-muted-foreground">Daily: {formatCurrency(dailyTakeHome)}</p>
                <p className="text-xs text-muted-foreground">Hourly: {formatCurrency(hourlyRate)}</p>
              </div>
            </div>
            
            <div className="p-2 bg-[#475569]/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Income Tax</p>
              <p className="font-semibold">{formatCurrency(results.incomeTax)}</p>
              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                <p>Basic: {taxBreakdown.basic.toFixed(1)}%</p>
                <p>Higher: {taxBreakdown.higher.toFixed(1)}%</p>
                <p>Additional: {taxBreakdown.additional.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="p-2 bg-[#94a3b8]/20 rounded-lg">
              <p className="text-sm text-muted-foreground">NI</p>
              <p className="font-semibold">{formatCurrency(results.nationalInsurance)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((results.nationalInsurance / grossIncome) * 100).toFixed(1)}% of gross income
              </p>
            </div>

            <div className="p-2 bg-[#0ea5e9]/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Pension</p>
              <p className="font-semibold">{formatCurrency(pensionContribution)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly contribution: {formatCurrency(pensionContribution / 12)}
              </p>
            </div>
          </div>

          <div className="col-span-3">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-2 bg-muted rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Effective Rate</p>
                  <p className="font-semibold">{results.effectiveTaxRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Marginal Rate</p>
                  <p className="font-semibold">{results.marginalTaxRate}%</p>
                </div>
              </div>

              <div className="col-span-2 p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Total Deductions</p>
                <p className="font-semibold">{formatCurrency(totalDeductions)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {deductionsPercentage.toFixed(1)}% of gross income
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
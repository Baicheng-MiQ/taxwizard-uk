import { Card } from "@/components/ui/card";
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
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm border border-gray-100">
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">Take Home</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(results.takeHomePay)}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-700">Monthly: {formatCurrency(monthlyTakeHome)}</p>
                <p className="text-xs text-green-700">Weekly: {formatCurrency(weeklyTakeHome)}</p>
                <p className="text-xs text-green-700">Daily: {formatCurrency(dailyTakeHome)}</p>
                <p className="text-xs text-green-700">Hourly: {formatCurrency(hourlyRate)}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Pension</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(pensionContribution)}</p>
              <p className="text-xs text-blue-700 mt-2">
                Monthly contribution: <br />
                {formatCurrency(pensionContribution / 12)}
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Income Tax</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(results.incomeTax)}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">Basic: {taxBreakdown.basic.toFixed(1)}%</p>
                <p className="text-xs text-gray-600">Higher: {taxBreakdown.higher.toFixed(1)}%</p>
                <p className="text-xs text-gray-600">Additional: {taxBreakdown.additional.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-800">NI</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(results.nationalInsurance)}</p>
              <p className="text-xs text-slate-600 mt-2">
                {((results.nationalInsurance / grossIncome) * 100).toFixed(1)}% of gross income
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

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 space-y-2">
                <div>
                  <p className="text-xs font-medium text-purple-800">Effective Rate</p>
                  <p className="text-lg font-bold text-purple-900">{results.effectiveTaxRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-800">Marginal Rate</p>
                  <p className="text-lg font-bold text-purple-900">{results.marginalTaxRate}%</p>
                </div>
              </div>

              <div className="col-span-2 p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                <p className="text-xs font-medium text-pink-800">Total Deductions</p>
                <p className="text-lg font-bold text-pink-900">{formatCurrency(totalDeductions)}</p>
                <p className="text-xs text-pink-700 mt-1">
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

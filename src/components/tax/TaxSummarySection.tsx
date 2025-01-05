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
          <div className="col-span-2 space-y-4">
            <div className="p-4 bg-[#F2FCE2] rounded-xl">
              <p className="text-lg text-gray-600 mb-1">Take Home</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.takeHomePay)}</p>
              <div className="mt-3 space-y-1">
                <p className="text-sm text-gray-600">Monthly: {formatCurrency(monthlyTakeHome)}</p>
                <p className="text-sm text-gray-600">Weekly: {formatCurrency(weeklyTakeHome)}</p>
                <p className="text-sm text-gray-600">Daily: {formatCurrency(dailyTakeHome)}</p>
                <p className="text-sm text-gray-600">Hourly: {formatCurrency(hourlyRate)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#F1F0FB] rounded-xl">
              <p className="text-lg text-gray-600 mb-1">Income Tax</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.incomeTax)}</p>
              <div className="mt-3 space-y-1">
                <p className="text-sm text-gray-600">Basic: {taxBreakdown.basic.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Higher: {taxBreakdown.higher.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Additional: {taxBreakdown.additional.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#F1F0FB] rounded-xl">
              <p className="text-lg text-gray-600 mb-1">NI</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.nationalInsurance)}</p>
              <p className="text-sm text-gray-600 mt-3">
                {((results.nationalInsurance / grossIncome) * 100).toFixed(1)}% of gross income
              </p>
            </div>

            <div className="p-4 bg-[#D3E4FD] rounded-xl">
              <p className="text-lg text-gray-600 mb-1">Pension</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pensionContribution)}</p>
              <p className="text-sm text-gray-600 mt-3">
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
              <div className="p-4 bg-[#F1F0FB] rounded-xl">
                <div className="space-y-3">
                  <div>
                    <p className="text-lg text-gray-600">Effective Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{results.effectiveTaxRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-600">Marginal Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{results.marginalTaxRate}%</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 p-4 bg-[#F1F0FB] rounded-xl">
                <p className="text-lg text-gray-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
                <p className="text-sm text-gray-600 mt-3">
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
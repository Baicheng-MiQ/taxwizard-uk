import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { calculateTax } from '@/utils/taxCalculations';

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
  // Calculate take home without pension
  const resultsWithoutPension = calculateTax(grossIncome, 0);
  const takeHomeWithoutPension = resultsWithoutPension.takeHomePay;
  
  // Calculate the actual reduction in take-home pay due to pension
  const salarySacrificeImpact = takeHomeWithoutPension - results.takeHomePay;
  
  // Calculate the effective cost (what the pension actually costs after tax savings)
  const effectivePensionCost = pensionContribution - (pensionContribution - salarySacrificeImpact);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-secondary/5">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="mb-4 md:mb-0 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Annual Take Home</h2>
            <div className="text-4xl font-bold text-secondary mb-6">
              {formatCurrency(results.takeHomePay)}
            </div>
            {pensionContribution > 0 && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Pension Impact:</p>
                <p>• Gross Reduction: {formatCurrency(salarySacrificeImpact)}</p>
                <p>• Effective Cost: {formatCurrency(effectivePensionCost)}</p>
                <p className="text-xs mt-1">
                  (Your {formatCurrency(pensionContribution)} pension only costs you {formatCurrency(effectivePensionCost)} due to tax savings)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:w-1/2">
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Monthly</p>
              <p className="text-xl font-semibold">{formatCurrency(monthlyTakeHome)}</p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Weekly</p>
              <p className="text-xl font-semibold">{formatCurrency(weeklyTakeHome)}</p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Daily</p>
              <p className="text-xl font-semibold">{formatCurrency(dailyTakeHome)}</p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Hourly</p>
              <p className="text-xl font-semibold">{formatCurrency(hourlyRate)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <div className="grid grid-rows-[auto_auto_1fr] gap-4">
          <Card className="p-5 bg-white">
            <h3 className="text-xl mb-1">Pension</h3>
            <p className="text-3xl font-bold text-sky-500 mb-3">-{formatCurrency(pensionContribution)}</p>
            <p className="text-sm text-gray-600">
              Monthly contribution: <br/> {formatCurrency(pensionContribution / 12)}
            </p>
          </Card>

          <Card className="p-5 bg-white">
            <h3 className="text-xl mb-1">Income Tax</h3>
            <p className="text-3xl font-bold text-red-600 mb-3">-{formatCurrency(results.incomeTax)}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Basic: {taxBreakdown.basic.toFixed(1)}%</p>
              <p>Higher: {taxBreakdown.higher.toFixed(1)}%</p>
              <p>Additional: {taxBreakdown.additional.toFixed(1)}%</p>
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <h3 className="text-xl mb-1">NI</h3>
            <p className="text-3xl font-bold text-red-600 mb-3">-{formatCurrency(results.nationalInsurance)}</p>
            <p className="text-sm text-gray-600">
              {((results.nationalInsurance / grossIncome) * 100).toFixed(1)}% of gross income
            </p>
          </Card>
        </div>

        <div className="grid grid-rows-[1fr_auto] gap-4">
          <Card className="p-4 bg-white">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      fontSize: '14px',
                      color: '#666'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white">
              <h3 className="text-lg text-gray-600 mb-1">Effective Rate</h3>
              <p className="text-3xl font-bold text-red-600 mb-2">{results.effectiveTaxRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">
                Marginal Rate: {results.marginalTaxRate}%
              </p>
            </Card>

            <Card className="p-4 bg-white">
              <h3 className="text-lg text-gray-600 mb-1">Total Deductions</h3>
              <p className="text-3xl font-bold mb-2">{formatCurrency(totalDeductions)}</p>
              <p className="text-sm text-gray-500">
                {deductionsPercentage.toFixed(1)}% of gross income
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
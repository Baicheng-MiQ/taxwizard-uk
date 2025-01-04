import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { TaxResults } from "@/utils/taxCalculations";

interface SummarySectionProps {
  results: TaxResults;
}

const SummarySection = ({ results }: SummarySectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-secondary">
          Take Home Pay: {formatCurrency(results.takeHomePay)}
        </p>
        <p>Income Tax: {formatCurrency(results.incomeTax)}</p>
        <p>National Insurance: {formatCurrency(results.nationalInsurance)}</p>
        <p>Total Deductions: {formatCurrency(results.totalDeductible)}</p>
        <p>Effective Tax Rate: {results.effectiveTaxRate.toFixed(1)}%</p>
        <p>Marginal Tax Rate: {results.marginalTaxRate}%</p>
        <p>Total Income: {formatCurrency(results.totalIncome)}</p>
      </div>
    </Card>
  );
};

export default SummarySection;
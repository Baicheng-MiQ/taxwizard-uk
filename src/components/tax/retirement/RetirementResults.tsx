import { CalculationResults } from '../types/retirement';

interface RetirementResultsProps {
  calculations: CalculationResults;
  formatCurrency: (value: number) => string;
}

export const RetirementResults = ({ calculations, formatCurrency }: RetirementResultsProps) => {
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
    </div>
  );
};
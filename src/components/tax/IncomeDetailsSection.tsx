import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface IncomeSectionProps {
  grossIncome: number;
  pensionPercentage: number;
  setPensionPercentage: (value: number) => void;
  setGrossIncome: (value: number) => void;
  formatCurrency: (value: number) => string;
}

export const IncomeDetailsSection = ({
  grossIncome,
  pensionPercentage,
  setPensionPercentage,
  setGrossIncome,
  formatCurrency,
}: IncomeSectionProps) => {
  const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    const numberValue = Number(value);
    if (numberValue <= 200000) {
      setGrossIncome(numberValue);
    }
  };

  return (
    <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Income Details</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="income" className="text-sm font-medium text-gray-700 mb-2 block">
            Gross Yearly Income
          </Label>
          <div className="flex gap-4 items-center">
            <Input
              type="text"
              id="income"
              value={formatCurrency(grossIncome)}
              onChange={handleIncomeChange}
              className="w-36 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <Slider
              id="income-slider"
              min={0}
              max={200000}
              step={100}
              value={[grossIncome]}
              onValueChange={(value) => setGrossIncome(value[0])}
              className="flex-1"
              variant="income"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="pension" className="text-sm font-medium text-gray-700 mb-2 block">
            Pension Contribution: {pensionPercentage}%
          </Label>
          <Slider
            id="pension"
            min={0}
            max={100}
            step={0.1}
            value={[pensionPercentage]}
            onValueChange={(value) => setPensionPercentage(value[0])}
            className="mt-2"
            variant="pension"
          />
        </div>
      </div>
    </Card>
  );
};
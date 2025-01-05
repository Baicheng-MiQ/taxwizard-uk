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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Income Details</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="income" className="text-lg font-medium">
            Gross Yearly Income
          </Label>
          <Input
            type="text"
            id="income"
            value={formatCurrency(grossIncome)}
            onChange={handleIncomeChange}
            className="text-lg font-medium"
          />
          <Slider
            id="income-slider"
            min={0}
            max={200000}
            step={100}
            value={[grossIncome]}
            onValueChange={(value) => setGrossIncome(value[0])}
            className="mt-2"
            variant="income"
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="pension" className="text-lg font-medium">
            Pension Contribution: {pensionPercentage}%
          </Label>
          <Slider
            id="pension"
            min={0}
            max={100}
            step={0.1}
            value={[pensionPercentage]}
            onValueChange={(value) => setPensionPercentage(value[0])}
            variant="pension"
          />
        </div>
      </div>
    </div>
  );
};
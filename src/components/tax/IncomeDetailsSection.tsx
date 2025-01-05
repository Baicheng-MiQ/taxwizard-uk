import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface IncomeSectionProps {
  grossIncome: number;
  pensionPercentage: number;
  setPensionPercentage: (value: number) => void;
  setGrossIncome: (value: number) => void;
  formatCurrency: (value: number) => void;
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
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Income Details</h2>
      <div className="space-y-2">
        <div>
          <Label htmlFor="income" className="text-sm">
            Gross Yearly Income
          </Label>
          <div className="flex gap-2 items-center my-2">
            <Input
              type="text"
              id="income"
              value={formatCurrency(grossIncome)}
              onChange={handleIncomeChange}
              className="w-36"
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
          <Label htmlFor="pension" className="text-sm">
            Pension Contribution: {pensionPercentage}%
          </Label>
          <Slider
            id="pension"
            min={0}
            max={100}
            step={0.1}
            value={[pensionPercentage]}
            onValueChange={(value) => setPensionPercentage(value[0])}
            className="my-2"
            variant="pension"
          />
        </div>
      </div>
    </Card>
  );
};
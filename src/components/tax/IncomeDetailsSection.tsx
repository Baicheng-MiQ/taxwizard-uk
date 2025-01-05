import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Income Details</h2>
      <div className="space-y-2">
        <div>
          <Label htmlFor="income" className="text-sm">
            Gross Yearly Income: {formatCurrency(grossIncome)}
          </Label>
          <Slider
            id="income"
            min={0}
            max={200000}
            step={100}
            value={[grossIncome]}
            onValueChange={(value) => setGrossIncome(value[0])}
            className="my-2"
            variant="income"
          />
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
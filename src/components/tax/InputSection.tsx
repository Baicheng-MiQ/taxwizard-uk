import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface InputSectionProps {
  grossIncome: number;
  setGrossIncome: (value: number) => void;
  pensionContribution: number;
  setPensionContribution: (value: number) => void;
}

const InputSection = ({
  grossIncome,
  setGrossIncome,
  pensionContribution,
  setPensionContribution,
}: InputSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Income Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="income">Gross Yearly Income</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">£</span>
            <Input
              id="income"
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
              className="pl-6"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="pension">Pension Contribution: {formatCurrency(pensionContribution)}</Label>
          <Slider
            id="pension"
            min={0}
            max={grossIncome}
            step={100}
            value={[pensionContribution]}
            onValueChange={(value) => setPensionContribution(value[0])}
            className="my-4"
          />
        </div>
      </div>
    </Card>
  );
};

export default InputSection;
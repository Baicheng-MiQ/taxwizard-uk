import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CalculationInputs } from "../types/retirement";

interface RetirementInputsProps {
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

export const RetirementInputs = ({ inputs, setInputs }: RetirementInputsProps) => {
  const handleInvestmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9.]/g, '');
    const parts = rawValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    const numericValue = parseFloat(sanitizedValue) || 0;
    setInputs({ ...inputs, additionalInvestment: numericValue });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="current-age">Current Age: {inputs.currentAge}</Label>
        <Slider
          id="current-age"
          min={18}
          max={80}
          step={1}
          value={[inputs.currentAge]}
          onValueChange={(value) => setInputs({ ...inputs, currentAge: value[0] })}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="retirement-age">Retirement Age: {inputs.retirementAge}</Label>
        <Slider
          id="retirement-age"
          min={inputs.currentAge + 1}
          max={85}
          step={1}
          value={[inputs.retirementAge]}
          onValueChange={(value) => setInputs({ ...inputs, retirementAge: value[0] })}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="additional-investment">
          Additional Yearly Investment (besides pension)
        </Label>
        <Input
          id="additional-investment"
          type="text"
          value={inputs.additionalInvestment.toLocaleString('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          onChange={handleInvestmentChange}
          className="text-right"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="employer-contribution">
          Employer Contribution: {inputs.employerContribution}%
        </Label>
        <Slider
          id="employer-contribution"
          min={0}
          max={20}
          step={0.5}
          value={[inputs.employerContribution]}
          onValueChange={(value) => setInputs({ ...inputs, employerContribution: value[0] })}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="wage-growth">
          Annual Wage Growth: {inputs.wageGrowth}%
        </Label>
        <Slider
          id="wage-growth"
          min={0}
          max={10}
          step={0.1}
          value={[inputs.wageGrowth]}
          onValueChange={(value) => setInputs({ ...inputs, wageGrowth: value[0] })}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="investment-growth">
          Expected Investment Growth: {inputs.investmentGrowth}%
        </Label>
        <Slider
          id="investment-growth"
          min={1}
          max={15}
          step={0.1}
          value={[inputs.investmentGrowth]}
          onValueChange={(value) => setInputs({ ...inputs, investmentGrowth: value[0] })}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="inflation">Expected Inflation: {inputs.inflation}%</Label>
        <Slider
          id="inflation"
          min={0}
          max={10}
          step={0.1}
          value={[inputs.inflation]}
          onValueChange={(value) => setInputs({ ...inputs, inflation: value[0] })}
        />
      </div>
    </div>
  );
};
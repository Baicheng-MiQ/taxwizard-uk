import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalculationInputs } from "../types/retirement";

interface RetirementInputsProps {
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

export const RetirementInputs = ({ inputs, setInputs }: RetirementInputsProps) => {
  return (
    <div className="space-y-8">
      {/* Primary inputs with larger text and spacing */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="current-age" className="text-xl font-semibold">
            Current Age: {inputs.currentAge}
          </Label>
          <Slider
            id="current-age"
            min={18}
            max={80}
            step={1}
            value={[inputs.currentAge]}
            onValueChange={(value) => setInputs({ ...inputs, currentAge: value[0] })}
            className="py-4"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="retirement-age" className="text-xl font-semibold">
            Retirement Age: {inputs.retirementAge}
          </Label>
          <Slider
            id="retirement-age"
            min={inputs.currentAge + 1}
            max={85}
            step={1}
            value={[inputs.retirementAge]}
            onValueChange={(value) => setInputs({ ...inputs, retirementAge: value[0] })}
            className="py-4"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="additional-investment" className="text-xl font-semibold">
            Additional Yearly Investment (besides pension): {inputs.additionalInvestment.toLocaleString('en-GB', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Label>
          <Slider
            id="additional-investment"
            min={0}
            max={50000}
            step={100}
            value={[inputs.additionalInvestment]}
            onValueChange={(value) => setInputs({ ...inputs, additionalInvestment: value[0] })}
            className="py-4"
          />
        </div>
      </div>

      {/* Secondary inputs with medium text */}
      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="employer-contribution" className="text-lg">
            Employer Contribution: {inputs.employerContribution}%
          </Label>
          <Slider
            id="employer-contribution"
            min={0}
            max={20}
            step={0.5}
            value={[inputs.employerContribution]}
            onValueChange={(value) => setInputs({ ...inputs, employerContribution: value[0] })}
            className="py-3"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="wage-growth" className="text-lg">
            Annual Wage Growth: {inputs.wageGrowth}%
          </Label>
          <Slider
            id="wage-growth"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.wageGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, wageGrowth: value[0] })}
            className="py-3"
          />
        </div>
      </div>

      {/* Tertiary inputs with smaller text */}
      <div className="space-y-4 opacity-80">
        <div className="space-y-2">
          <Label htmlFor="investment-growth" className="text-base">
            Expected Investment Growth: {inputs.investmentGrowth}%
          </Label>
          <Slider
            id="investment-growth"
            min={1}
            max={15}
            step={0.1}
            value={[inputs.investmentGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, investmentGrowth: value[0] })}
            className="py-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inflation" className="text-base">
            Expected Inflation: {inputs.inflation}%
          </Label>
          <Slider
            id="inflation"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.inflation]}
            onValueChange={(value) => setInputs({ ...inputs, inflation: value[0] })}
            className="py-2"
          />
        </div>
      </div>
    </div>
  );
};
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CalculationInputs } from "../types/retirement";

interface RetirementInputsProps {
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

export const RetirementInputs = ({ inputs, setInputs }: RetirementInputsProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="current-age" className="text-lg font-semibold mb-6 block">
            Current Age: {inputs.currentAge}
          </Label>
          <Slider
            id="current-age"
            min={18}
            max={80}
            step={1}
            value={[inputs.currentAge]}
            onValueChange={(value) => setInputs({ ...inputs, currentAge: value[0] })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="retirement-age" className="text-lg font-semibold mb-6 block">
            Retirement Age: {inputs.retirementAge}
          </Label>
          <Slider
            id="retirement-age"
            min={inputs.currentAge + 1}
            max={85}
            step={1}
            value={[inputs.retirementAge]}
            onValueChange={(value) => setInputs({ ...inputs, retirementAge: value[0] })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="additional-investment" className="text-lg font-semibold mb-6 block">
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
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="employer-contribution" className="text-lg font-semibold mb-6 block">
            Employer Contribution: {inputs.employerContribution}%
          </Label>
          <Slider
            id="employer-contribution"
            min={0}
            max={20}
            step={0.5}
            value={[inputs.employerContribution]}
            onValueChange={(value) => setInputs({ ...inputs, employerContribution: value[0] })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="wage-growth" className="text-lg font-semibold mb-6 block">
            Annual Wage Growth: {inputs.wageGrowth}%
          </Label>
          <Slider
            id="wage-growth"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.wageGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, wageGrowth: value[0] })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="investment-growth" className="text-lg font-semibold mb-6 block">
            Expected Investment Growth: {inputs.investmentGrowth}%
          </Label>
          <Slider
            id="investment-growth"
            min={1}
            max={15}
            step={0.1}
            value={[inputs.investmentGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, investmentGrowth: value[0] })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="inflation" className="text-lg font-semibold mb-6 block">
            Expected Inflation: {inputs.inflation}%
          </Label>
          <Slider
            id="inflation"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.inflation]}
            onValueChange={(value) => setInputs({ ...inputs, inflation: value[0] })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
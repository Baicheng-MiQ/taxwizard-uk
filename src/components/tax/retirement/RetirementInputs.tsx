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
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="current-age" className="text-xl font-semibold">
              Current Age
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.currentAge}</span>
          </div>
          <Slider
            id="current-age"
            min={18}
            max={80}
            step={1}
            value={[inputs.currentAge]}
            onValueChange={(value) => setInputs({ ...inputs, currentAge: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="retirement-age" className="text-xl font-semibold">
              Retirement Age
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.retirementAge}</span>
          </div>
          <Slider
            id="retirement-age"
            min={inputs.currentAge + 1}
            max={85}
            step={1}
            value={[inputs.retirementAge]}
            onValueChange={(value) => setInputs({ ...inputs, retirementAge: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="additional-investment" className="text-xl font-semibold">
              Additional Yearly Investment
            </Label>
            <span className="text-2xl font-bold text-secondary">
              £{inputs.additionalInvestment.toLocaleString()}
            </span>
          </div>
          <Slider
            id="additional-investment"
            min={0}
            max={50000}
            step={100}
            value={[inputs.additionalInvestment]}
            onValueChange={(value) => setInputs({ ...inputs, additionalInvestment: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="employer-contribution" className="text-xl font-semibold">
              Employer Contribution
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.employerContribution}%</span>
          </div>
          <Slider
            id="employer-contribution"
            min={0}
            max={20}
            step={0.5}
            value={[inputs.employerContribution]}
            onValueChange={(value) => setInputs({ ...inputs, employerContribution: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="wage-growth" className="text-xl font-semibold">
              Annual Wage Growth
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.wageGrowth}%</span>
          </div>
          <Slider
            id="wage-growth"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.wageGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, wageGrowth: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="investment-growth" className="text-xl font-semibold">
              Expected Investment Growth
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.investmentGrowth}%</span>
          </div>
          <Slider
            id="investment-growth"
            min={1}
            max={15}
            step={0.1}
            value={[inputs.investmentGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, investmentGrowth: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="inflation" className="text-xl font-semibold">
              Expected Inflation
            </Label>
            <span className="text-2xl font-bold text-secondary">{inputs.inflation}%</span>
          </div>
          <Slider
            id="inflation"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.inflation]}
            onValueChange={(value) => setInputs({ ...inputs, inflation: value[0] })}
            className="my-4"
            variant="retirement"
          />
        </div>
      </div>
    </div>
  );
};
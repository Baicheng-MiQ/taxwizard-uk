import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalculationInputs } from "../types/retirement";

interface RetirementInputsProps {
  inputs: CalculationInputs;
  setInputs: (inputs: CalculationInputs) => void;
}

export const RetirementInputs = ({ inputs, setInputs }: RetirementInputsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="current-age" className="text-base font-medium">
              Current Age
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.currentAge}</span>
          </div>
          <Slider
            id="current-age"
            min={18}
            max={80}
            step={1}
            value={[inputs.currentAge]}
            onValueChange={(value) => setInputs({ ...inputs, currentAge: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="retirement-age" className="text-base font-medium">
              Retirement Age
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.retirementAge}</span>
          </div>
          <Slider
            id="retirement-age"
            min={inputs.currentAge + 1}
            max={85}
            step={1}
            value={[inputs.retirementAge]}
            onValueChange={(value) => setInputs({ ...inputs, retirementAge: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="salary" className="text-base font-medium">
              Annual Salary
            </Label>
            <span className="text-lg font-semibold text-secondary">
              £{inputs.salary.toLocaleString()}
            </span>
          </div>
          <Slider
            id="salary"
            min={10000}
            max={200000}
            step={1000}
            value={[inputs.salary]}
            onValueChange={(value) => setInputs({ ...inputs, salary: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="personal-contribution" className="text-base font-medium">
              Personal Pension Contribution
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.personalContribution}%</span>
          </div>
          <Slider
            id="personal-contribution"
            min={0}
            max={40}
            step={0.5}
            value={[inputs.personalContribution]}
            onValueChange={(value) => setInputs({ ...inputs, personalContribution: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="employer-contribution" className="text-base font-medium">
              Employer Contribution
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.employerContribution}%</span>
          </div>
          <Slider
            id="employer-contribution"
            min={0}
            max={20}
            step={0.5}
            value={[inputs.employerContribution]}
            onValueChange={(value) => setInputs({ ...inputs, employerContribution: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="additional-investment" className="text-base font-medium">
              Additional Yearly Investment
            </Label>
            <span className="text-lg font-semibold text-secondary">
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
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="investment-growth" className="text-base font-medium">
              Investment Growth
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.investmentGrowth}%</span>
          </div>
          <Slider
            id="investment-growth"
            min={1}
            max={15}
            step={0.1}
            value={[inputs.investmentGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, investmentGrowth: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="wage-growth" className="text-base font-medium">
              Annual Wage Growth
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.wageGrowth}%</span>
          </div>
          <Slider
            id="wage-growth"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.wageGrowth]}
            onValueChange={(value) => setInputs({ ...inputs, wageGrowth: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="inflation" className="text-base font-medium">
              Expected Inflation
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.inflation}%</span>
          </div>
          <Slider
            id="inflation"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.inflation]}
            onValueChange={(value) => setInputs({ ...inputs, inflation: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="withdrawal-rate" className="text-base font-medium">
              Withdrawal Rate
            </Label>
            <span className="text-lg font-semibold text-secondary">{inputs.withdrawalRate}%</span>
          </div>
          <Slider
            id="withdrawal-rate"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.withdrawalRate]}
            onValueChange={(value) => setInputs({ ...inputs, withdrawalRate: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="lump-sum" className="text-base font-medium">
              Pension Lump Sum
            </Label>
            <span className="text-lg font-semibold text-secondary">
              £{inputs.lumpSum.toLocaleString()}
            </span>
          </div>
          <Slider
            id="lump-sum"
            min={0}
            max={100000}
            step={1000}
            value={[inputs.lumpSum]}
            onValueChange={(value) => setInputs({ ...inputs, lumpSum: value[0] })}
            className="my-2"
            variant="retirement"
          />
        </div>
      </div>
    </div>
  );
};
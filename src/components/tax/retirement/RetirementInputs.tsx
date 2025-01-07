import { Slider } from "@/components/ui/slider";
import { CalculationInputs } from "../types/retirement";

interface RetirementInputsProps {
  inputs: CalculationInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculationInputs>>;
  formatCurrency: (value: number) => string;
}

export const RetirementInputs = ({ inputs, setInputs, formatCurrency }: RetirementInputsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Current Age: {inputs.currentAge}
            </label>
            <Slider 
              value={[inputs.currentAge]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, currentAge: v }))}
              min={18}
              max={80}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Retirement Age: {inputs.retirementAge}
            </label>
            <Slider 
              value={[inputs.retirementAge]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, retirementAge: v }))}
              min={inputs.currentAge}
              max={80}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Annual Salary: {formatCurrency(inputs.salary)}
            </label>
            <Slider 
              value={[inputs.salary]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, salary: v }))}
              min={10000}
              max={200000}
              step={1000}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Personal Pension Contribution: {inputs.personalContrib}%
            </label>
            <Slider 
              value={[inputs.personalContrib]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, personalContrib: v }))}
              min={0}
              max={40}
              step={0.5}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Employer Contribution: {inputs.employerContrib}%
            </label>
            <Slider 
              value={[inputs.employerContrib]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, employerContrib: v }))}
              min={0}
              max={20}
              step={0.5}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Investment Growth: {inputs.investmentGrowth}%
            </label>
            <Slider 
              value={[inputs.investmentGrowth]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, investmentGrowth: v }))}
              min={0}
              max={12}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Additional Yearly Investment: {formatCurrency(inputs.additionalInvestment)}
            </label>
            <Slider 
              value={[inputs.additionalInvestment]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, additionalInvestment: v }))}
              min={0}
              max={50000}
              step={100}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Inflation Rate: {inputs.inflationRate}%
            </label>
            <Slider 
              value={[inputs.inflationRate]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, inflationRate: v }))}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Withdrawal Rate: {inputs.withdrawRate}%
            </label>
            <Slider 
              value={[inputs.withdrawRate]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, withdrawRate: v }))}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pension Lump Sum: {formatCurrency(inputs.lumpSum)}
            </label>
            <Slider 
              value={[inputs.lumpSum]} 
              onValueChange={([v]) => setInputs(prev => ({ ...prev, lumpSum: v }))}
              min={0}
              max={100000}
              step={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
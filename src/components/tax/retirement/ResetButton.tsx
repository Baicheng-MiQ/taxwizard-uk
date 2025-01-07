import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { CalculationInputs } from "../types/retirement";

interface ResetButtonProps {
  setInputs: (inputs: CalculationInputs) => void;
}

const defaultInputs: CalculationInputs = {
  currentAge: 22,
  retirementAge: 65,
  additionalInvestment: 20000,
  investmentGrowth: 7,
  inflation: 2.7,
  employerContribution: 5,
  wageGrowth: 5,
  withdrawalRate: 4
};

export const ResetButton = ({ setInputs }: ResetButtonProps) => {
  const handleReset = () => {
    setInputs(defaultInputs);
  };

  return (
    <Button 
      onClick={handleReset}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RotateCw className="h-4 w-4" />
      Reset
    </Button>
  );
};
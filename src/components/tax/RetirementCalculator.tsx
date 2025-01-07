import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RetirementInputs } from "./retirement/RetirementInputs";
import { RetirementResults } from "./retirement/RetirementResults";
import { RetirementCalculatorProps, CalculationInputs } from "./types/retirement";
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  Briefcase,
  Building,
  LineChart,
  PiggyBank,
  BadgePercent,
  Clock
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const RetirementCalculator = ({ formatCurrency, pensionContribution }: RetirementCalculatorProps) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    currentAge: 22,
    retirementAge: 65,
    additionalInvestment: 20000,
    investmentGrowth: 7,
    inflation: 2.7,
    employerContribution: 5,
    wageGrowth: 5,
    withdrawalRate: 4 // Added withdrawal rate as a user input
  });

  const calculations = useMemo(() => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearsInRetirement = 90 - inputs.retirementAge;
    const realReturn = (1 + inputs.investmentGrowth / 100) / (1 + inputs.inflation / 100) - 1;
    
    let totalSavings = 0;
    let currentSalary = pensionContribution > 0 
      ? pensionContribution * 20
      : 20000;
      
    const yearlyData = [];

    // Calculate accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const employeeContribution = pensionContribution;
      const employerContribution = currentSalary * (inputs.employerContribution / 100);
      const totalContribution = employeeContribution + employerContribution + inputs.additionalInvestment;
      
      if (totalContribution > 0) {
        totalSavings = (totalSavings + totalContribution) * (1 + realReturn);
      }
      
      yearlyData.push({
        age: inputs.currentAge + year,
        savings: Math.round(totalSavings),
        withdrawal: 0 // No withdrawals during accumulation
      });

      currentSalary *= (1 + inputs.wageGrowth / 100);
    }

    // Calculate drawdown phase with user-defined withdrawal rate
    let remainingSavings = totalSavings;
    for (let year = 1; year <= yearsInRetirement; year++) {
      const withdrawalRate = inputs.withdrawalRate / 100;
      const thisYearWithdrawal = remainingSavings * withdrawalRate;
      
      remainingSavings = (remainingSavings - thisYearWithdrawal) * (1 + realReturn);
      
      yearlyData.push({
        age: inputs.retirementAge + year,
        savings: Math.round(remainingSavings),
        withdrawal: Math.round(thisYearWithdrawal)
      });
    }

    // Calculate initial and final withdrawal amounts for range display
    const initialWithdrawal = totalSavings * (inputs.withdrawalRate / 100);
    const finalWithdrawal = yearlyData[yearlyData.length - 1].withdrawal;

    return {
      totalAtRetirement: totalSavings,
      initialWithdrawal,
      finalWithdrawal,
      yearlyData,
    };
  }, [inputs, pensionContribution]);

  const assumptions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Life Expectancy",
      description: "Calculations assume a life expectancy of 90 years"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Investment Returns",
      description: "Returns are assumed to remain constant year over year at the specified rate"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Inflation",
      description: "A constant inflation rate is applied throughout the projection"
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      title: "Withdrawal Strategy",
      description: "Uses a modified 4% rule, adjusted based on real returns"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Contribution Timing",
      description: "All investments and pension contributions are made at year-end"
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: "State Pension",
      description: "Calculations exclude state pension and other retirement income sources"
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Tax Considerations",
      description: "Tax implications during the withdrawal phase are not included"
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Market Volatility",
      description: "Market volatility and sequence of returns risk are not considered"
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Employment",
      description: "Assumes continuous employment with consistent contributions"
    },
    {
      icon: <BadgePercent className="h-5 w-5" />,
      title: "Employer Contributions",
      description: "Calculated as a percentage of gross salary"
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Retirement Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <RetirementInputs inputs={inputs} setInputs={setInputs} />
        <RetirementResults calculations={calculations} formatCurrency={formatCurrency} />
      </div>

      <Separator className="my-8" />
      
      <div className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="assumptions">
            <AccordionTrigger className="text-lg font-medium">
              Calculator Assumptions
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {assumptions.map((assumption, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                  >
                    <div className="text-secondary mt-1">
                      {assumption.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{assumption.title}</h4>
                      <p className="text-sm text-muted-foreground">{assumption.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RetirementInputs } from "./retirement/RetirementInputs";
import { RetirementResults } from "./retirement/RetirementResults";
import { RetirementGraph } from "./retirement/RetirementGraph";
import { ResetButton } from "./retirement/ResetButton";
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
    additionalInvestment: 5000,
    investmentGrowth: 7,
    inflation: 2.7,
    employerContribution: 5,
    wageGrowth: 3,
    withdrawalRate: 4
  });

  const calculations = useMemo(() => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearsInRetirement = 90 - inputs.retirementAge;
    const realReturn = (1 + inputs.investmentGrowth / 100) / (1 + inputs.inflation / 100) - 1;
    
    let pensionPot = 0;
    let investmentPot = 0;
    let currentSalary = pensionContribution > 0 
      ? pensionContribution * 20
      : 20000;
      
    const yearlyData = [];
    const PENSION_ACCESS_AGE = 57;

    // Calculate accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAge = inputs.currentAge + year;
      const employeeContribution = pensionContribution;
      const employerContribution = currentSalary * (inputs.employerContribution / 100);
      
      // Add pension contributions only until retirement
      if (currentAge <= inputs.retirementAge) {
        pensionPot = (pensionPot + employeeContribution + employerContribution) * (1 + realReturn);
      } else {
        // After retirement but before pension access age, continue growing the pension pot with investment returns
        pensionPot = pensionPot * (1 + realReturn);
      }
      
      // Add investment contributions until retirement
      if (currentAge <= inputs.retirementAge) {
        investmentPot = (investmentPot + inputs.additionalInvestment) * (1 + realReturn);
      }
      
      yearlyData.push({
        age: currentAge,
        savings: Math.round(pensionPot + investmentPot),
        pensionPot: Math.round(pensionPot),
        investmentPot: Math.round(investmentPot),
        withdrawal: 0
      });

      currentSalary *= (1 + inputs.wageGrowth / 100);
    }

    // Calculate drawdown phase
    let remainingPensionPot = pensionPot;
    let remainingInvestmentPot = investmentPot;
    
    for (let year = 1; year <= yearsInRetirement; year++) {
      const currentAge = inputs.retirementAge + year;
      const withdrawalRate = inputs.withdrawalRate / 100;
      let totalWithdrawal = 0;

      // Handle investment withdrawals (available from retirement age)
      if (remainingInvestmentPot > 0) {
        const investmentWithdrawal = remainingInvestmentPot * withdrawalRate;
        totalWithdrawal += investmentWithdrawal;
        remainingInvestmentPot = (remainingInvestmentPot - investmentWithdrawal) * (1 + realReturn);
      }

      // Handle pension withdrawals (only available from age 57)
      if (currentAge >= PENSION_ACCESS_AGE && remainingPensionPot > 0) {
        const pensionWithdrawal = remainingPensionPot * withdrawalRate;
        totalWithdrawal += pensionWithdrawal;
        remainingPensionPot = (remainingPensionPot - pensionWithdrawal) * (1 + realReturn);
      } else if (remainingPensionPot > 0) {
        // Continue growing pension pot with investment returns until access age
        remainingPensionPot = remainingPensionPot * (1 + realReturn);
      }

      yearlyData.push({
        age: currentAge,
        savings: Math.round(remainingPensionPot + remainingInvestmentPot),
        pensionPot: Math.round(remainingPensionPot),
        investmentPot: Math.round(remainingInvestmentPot),
        withdrawal: Math.round(totalWithdrawal)
      });
    }

    // Calculate initial and final withdrawal amounts for range display
    const initialWithdrawal = yearlyData.find(d => d.withdrawal > 0)?.withdrawal || 0;
    const finalWithdrawal = yearlyData[yearlyData.length - 1].withdrawal;

    return {
      totalAtRetirement: pensionPot + investmentPot,
      initialWithdrawal,
      finalWithdrawal,
      yearlyData,
    };
  }, [inputs, pensionContribution]);

  const assumptions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Life Expectancy",
      description: "Calculations run until age 90, providing projections for both accumulation and drawdown phases"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Investment Returns",
      description: "Investment returns are calculated after inflation (real returns) and compound annually"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Inflation Impact",
      description: "All projections are in today's money - future values are adjusted for inflation"
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      title: "Pension Access",
      description: "Pension funds can only be accessed from age 57, while other investments are available immediately at retirement"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Investment Split",
      description: "Separate tracking of pension and non-pension investments, each with their own growth calculations"
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: "Contribution Structure",
      description: "Employee and employer pension contributions are calculated as percentages of salary"
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Withdrawal Strategy",
      description: "Annual withdrawals are taken proportionally from both pension and investment pots when accessible"
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Growth Calculation",
      description: "Real returns are calculated by adjusting nominal returns for inflation: (1 + return)/(1 + inflation) - 1"
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Salary Progression",
      description: "Annual salary increases compound based on the wage growth rate"
    },
    {
      icon: <BadgePercent className="h-5 w-5" />,
      title: "Additional Savings",
      description: "Non-pension investments can be added through fixed yearly contributions"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Retirement Calculator</h2>
        <ResetButton setInputs={setInputs} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <RetirementInputs inputs={inputs} setInputs={setInputs} />
        <RetirementResults calculations={calculations} formatCurrency={formatCurrency} />
      </div>

      <Card className="p-6">
        <RetirementGraph calculations={calculations} formatCurrency={formatCurrency} />
      </Card>

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
    </div>
  );
};
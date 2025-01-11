import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RetirementInputs } from "./RetirementInputs";
import { RetirementResults } from "./RetirementResults";
import { RetirementGraph } from "./RetirementGraph";
import { ResetButton } from "./ResetButton";
import { RetirementCalculatorProps, CalculationInputs } from "../types/retirement";
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
      
      if (currentAge <= inputs.retirementAge) {
        pensionPot = (pensionPot + employeeContribution + employerContribution) * (1 + realReturn);
      } else {
        pensionPot = pensionPot * (1 + realReturn);
      }
      
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

    // Calculate drawdown phase with consistent withdrawal rate
    let remainingPensionPot = pensionPot;
    let remainingInvestmentPot = investmentPot;
    
    // Calculate initial total pot for withdrawal rate calculation
    const totalInitialPot = pensionPot + investmentPot;
    const targetWithdrawal = totalInitialPot * (inputs.withdrawalRate / 100);
    
    for (let year = 1; year <= yearsInRetirement; year++) {
      const currentAge = inputs.retirementAge + year;
      let totalWithdrawal = targetWithdrawal;

      // Before pension access age
      if (currentAge < PENSION_ACCESS_AGE) {
        // If we have enough in investments, take the full withdrawal
        if (remainingInvestmentPot >= totalWithdrawal) {
          remainingInvestmentPot = (remainingInvestmentPot - totalWithdrawal) * (1 + realReturn);
          remainingPensionPot = remainingPensionPot * (1 + realReturn);
        } else {
          // If not enough in investments, we can only withdraw what's available
          totalWithdrawal = remainingInvestmentPot;
          remainingInvestmentPot = 0;
          remainingPensionPot = remainingPensionPot * (1 + realReturn);
        }
      } else {
        // After pension access age, withdraw proportionally from both pots
        const totalAvailable = remainingInvestmentPot + remainingPensionPot;
        
        if (totalAvailable >= totalWithdrawal) {
          const investmentProportion = remainingInvestmentPot / totalAvailable;
          const pensionProportion = remainingPensionPot / totalAvailable;

          const investmentWithdrawal = totalWithdrawal * investmentProportion;
          const pensionWithdrawal = totalWithdrawal * pensionProportion;

          remainingInvestmentPot = (remainingInvestmentPot - investmentWithdrawal) * (1 + realReturn);
          remainingPensionPot = (remainingPensionPot - pensionWithdrawal) * (1 + realReturn);
        } else {
          // If we don't have enough for full withdrawal, take what's available
          totalWithdrawal = totalAvailable;
          remainingInvestmentPot = 0;
          remainingPensionPot = 0;
        }
      }

      yearlyData.push({
        age: currentAge,
        savings: Math.round(remainingPensionPot + remainingInvestmentPot),
        pensionPot: Math.round(remainingPensionPot),
        investmentPot: Math.round(remainingInvestmentPot),
        withdrawal: Math.round(totalWithdrawal)
      });
    }

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
    { icon: <Calendar className="h-5 w-5" />, title: "Life Expectancy", description: "Calculations run until age 90" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "Investment Returns", description: "Returns calculated after inflation" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Inflation Impact", description: "All projections in today's money" },
    { icon: <PiggyBank className="h-5 w-5" />, title: "Pension Access", description: "Accessible from age 57" },
    { icon: <Clock className="h-5 w-5" />, title: "Investment Split", description: "Separate pension and investment tracking" },
    { icon: <Building className="h-5 w-5" />, title: "Contributions", description: "Based on salary percentage" },
    { icon: <AlertCircle className="h-5 w-5" />, title: "Withdrawals", description: "Proportional from both pots" },
    { icon: <LineChart className="h-5 w-5" />, title: "Growth", description: "Adjusted for inflation" },
    { icon: <Briefcase className="h-5 w-5" />, title: "Salary", description: "Annual compound growth" },
    { icon: <BadgePercent className="h-5 w-5" />, title: "Additional Savings", description: "Fixed yearly amount" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Retirement Calculator</h2>
        <ResetButton setInputs={setInputs} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <RetirementInputs inputs={inputs} setInputs={setInputs} />
        <RetirementResults calculations={calculations} formatCurrency={formatCurrency} />
      </div>

      <Card className="p-4">
        <RetirementGraph calculations={calculations} formatCurrency={formatCurrency} />
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="assumptions">
          <AccordionTrigger className="text-base">
            Calculator Assumptions
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {assumptions.map((assumption, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-2 p-2 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                >
                  <div className="text-secondary mt-0.5">
                    {assumption.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{assumption.title}</h4>
                    <p className="text-xs text-muted-foreground">{assumption.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

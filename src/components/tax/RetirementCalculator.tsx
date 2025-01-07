import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RetirementInputs } from "./retirement/RetirementInputs";
import { RetirementResults } from "./retirement/RetirementResults";
import { RetirementCalculatorProps, CalculationInputs } from "./types/retirement";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Calendar, TrendingUp, DollarSign, AlertCircle, Briefcase,
  Building, LineChart, PiggyBank, BadgePercent, Clock
} from "lucide-react";

export const RetirementCalculator = ({ formatCurrency }: RetirementCalculatorProps) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    currentAge: 30,
    retirementAge: 65,
    salary: 50000,
    personalContribution: 5,
    employerContribution: 3,
    wageGrowth: 2,
    investmentGrowth: 6,
    additionalInvestment: 5000,
    inflation: 2,
    withdrawalRate: 4,
    lumpSum: 20000
  });

  const calculations = useMemo(() => {
    const params = {
      current_age: inputs.currentAge,
      retirement_age: inputs.retirementAge,
      pension_access_age: 57,
      salary: inputs.salary,
      personal_contrib: inputs.personalContribution / 100,
      employer_contrib: inputs.employerContribution / 100,
      salary_growth: inputs.wageGrowth / 100,
      investment_growth: inputs.investmentGrowth / 100,
      additional_investment: inputs.additionalInvestment,
      inflation_rate: inputs.inflation / 100,
      withdraw_rate: inputs.withdrawalRate / 100,
      lump_sum: inputs.lumpSum
    };

    const calculateProjection = (age: number) => {
      let pensionPot = 0;
      let investmentPot = 0;
      let currentSalary = params.salary;
      let calculatedMonthlyIncome = 0;
      
      const realSalaryGrowth = (1 + params.salary_growth) / (1 + params.inflation_rate) - 1;
      const realInvestmentGrowth = (1 + params.investment_growth) / (1 + params.inflation_rate) - 1;

      for (let year = params.current_age; year <= age; year++) {
        if (year > params.current_age) {
          currentSalary *= (1 + realSalaryGrowth);
        }

        if (year < params.retirement_age) {
          const pensionContribution = currentSalary * 
            (params.personal_contrib + params.employer_contrib);
          pensionPot += pensionContribution;
          investmentPot += params.additional_investment;

          pensionPot += (pensionContribution * realInvestmentGrowth / 2);
          investmentPot += (params.additional_investment * realInvestmentGrowth / 2);

          calculatedMonthlyIncome = 0;
        } else {
          calculatedMonthlyIncome = 0;
          
          if (year >= params.pension_access_age) {
            if (year === params.pension_access_age) {
              pensionPot = Math.max(0, pensionPot - params.lump_sum);
            }
            
            const totalPot = pensionPot + investmentPot;
            if (totalPot > 0) {
              const annualWithdrawal = totalPot * params.withdraw_rate;
              calculatedMonthlyIncome = annualWithdrawal / 12;

              const pensionRatio = pensionPot / totalPot;
              const investmentRatio = investmentPot / totalPot;
              
              pensionPot = Math.max(0, pensionPot - (annualWithdrawal * pensionRatio));
              investmentPot = Math.max(0, investmentPot - (annualWithdrawal * investmentRatio));
            }
          } else {
            if (investmentPot > 0) {
              const annualWithdrawal = investmentPot * params.withdraw_rate;
              calculatedMonthlyIncome = annualWithdrawal / 12;
              investmentPot = Math.max(0, investmentPot - annualWithdrawal);
            }
          }
        }

        pensionPot *= (1 + realInvestmentGrowth);
        investmentPot *= (1 + realInvestmentGrowth);
      }

      return {
        pensionPot: Math.max(0, pensionPot),
        investmentPot: Math.max(0, investmentPot),
        monthlyIncome: Math.max(0, calculatedMonthlyIncome)
      };
    };

    const maxAge = Math.max(90, params.retirement_age + 25);
    const yearlyData = Array.from({ length: maxAge - params.current_age + 1 }, (_, i) => {
      const age = params.current_age + i;
      const { pensionPot, investmentPot, monthlyIncome } = calculateProjection(age);
      return {
        age,
        totalWealth: pensionPot + investmentPot,
        pensionPot,
        investmentPot,
        monthlyIncome
      };
    });

    return { yearlyData };
  }, [inputs]);

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
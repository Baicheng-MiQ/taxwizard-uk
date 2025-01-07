import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RetirementInputs } from "./retirement/RetirementInputs";
import { RetirementResults } from "./retirement/RetirementResults";
import { CalculationInputs, RetirementCalculatorProps } from "./types/retirement";
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

export const RetirementCalculator = ({ formatCurrency }: RetirementCalculatorProps) => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    currentAge: 30,
    retirementAge: 65,
    salary: 50000,
    personalContrib: 5,
    employerContrib: 3,
    salaryGrowth: 2,
    investmentGrowth: 6,
    additionalInvestment: 5000,
    inflationRate: 2,
    withdrawRate: 4,
    lumpSum: 20000
  });

  const projectionData = useMemo(() => {
    const params = {
      current_age: inputs.currentAge,
      retirement_age: inputs.retirementAge,
      pension_access_age: 57,
      salary: inputs.salary,
      personal_contrib: inputs.personalContrib / 100,
      employer_contrib: inputs.employerContrib / 100,
      salary_growth: inputs.salaryGrowth / 100,
      investment_growth: inputs.investmentGrowth / 100,
      additional_investment: inputs.additionalInvestment,
      inflation_rate: inputs.inflationRate / 100,
      withdraw_rate: inputs.withdrawRate / 100,
      lump_sum: inputs.lumpSum
    };

    const getTargetMonthlyIncome = (pensionPot, investmentPot) => {
      return (pensionPot + investmentPot) * params.withdraw_rate / 12;
    };

    const calculateYearlyProjection = (age) => {
      if (age < params.current_age) return { 
        pensionPot: 0, 
        investmentPot: 0,
        monthlyIncome: 0 
      };
      
      let pensionPot = 0;
      let investmentPot = 0;
      let currentSalary = params.salary;
      let realSalaryGrowth = (1 + params.salary_growth) / (1 + params.inflation_rate) - 1;
      let realInvestmentGrowth = (1 + params.investment_growth) / (1 + params.inflation_rate) - 1;
      
      for (let year = params.current_age; year <= age; year++) {
        // Apply salary growth at the start of the year
        if (year > params.current_age) {
          currentSalary *= (1 + realSalaryGrowth);
        }

        // Pre-retirement contributions
        if (year < params.retirement_age) {
          // Pension contributions (adjusted for real returns)
          const pensionContribution = currentSalary * 
            (params.personal_contrib + params.employer_contrib);
          pensionPot += pensionContribution;
          
          // Additional investment (adjusted for real returns)
          investmentPot += params.additional_investment;
          
          // Apply half-year growth to new contributions
          pensionPot += (pensionContribution * realInvestmentGrowth / 2);
          investmentPot += (params.additional_investment * realInvestmentGrowth / 2);
        }
        
        // Post-retirement withdrawals and income
        let monthlyIncome = 0;
        if (year >= params.retirement_age) {
          const targetMonthlyIncome = getTargetMonthlyIncome(pensionPot, investmentPot);
          
          // Handle pension access age restrictions
          if (year >= params.pension_access_age) {
            // One-time lump sum withdrawal
            if (year === params.pension_access_age) {
              pensionPot = Math.max(0, pensionPot - params.lump_sum);
            }
            
            // Calculate withdrawals from both sources
            const totalWealth = pensionPot + investmentPot;
            if (totalWealth > 0) {
              // Withdraw proportionally from both pots
              const pensionRatio = pensionPot / totalWealth;
              const investmentRatio = investmentPot / totalWealth;
              
              const annualWithdrawal = targetMonthlyIncome * 12;
              const pensionWithdrawal = annualWithdrawal * pensionRatio;
              const investmentWithdrawal = annualWithdrawal * investmentRatio;
              
              pensionPot = Math.max(0, pensionPot - pensionWithdrawal);
              investmentPot = Math.max(0, investmentPot - investmentWithdrawal);
              monthlyIncome = targetMonthlyIncome;
            }
          } else {
            // Before pension access age, withdraw only from investments
            const annualWithdrawal = Math.min(
              targetMonthlyIncome * 12,
              investmentPot * params.withdraw_rate
            );
            investmentPot = Math.max(0, investmentPot - annualWithdrawal);
            monthlyIncome = annualWithdrawal / 12;
          }
        }
        
        // Apply remaining annual growth
        pensionPot *= (1 + realInvestmentGrowth);
        investmentPot *= (1 + realInvestmentGrowth);
        
        // Store monthly income for the year
        monthlyIncome = Math.max(0, monthlyIncome);
      }
      
      return {
        pensionPot: Math.max(0, pensionPot),
        investmentPot: Math.max(0, investmentPot),
        monthlyIncome
      };
    };

    // Generate data points
    const maxAge = Math.max(90, params.retirement_age + 25);
    return Array.from({ length: maxAge - params.current_age + 1 }, (_, i) => {
      const age = params.current_age + i;
      const { pensionPot, investmentPot, monthlyIncome } = calculateYearlyProjection(age);
      return {
        age,
        totalWealth: pensionPot + investmentPot,
        pensionPot,
        investmentPot,
        monthlyIncome
      };
    });
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
      <CardHeader>
        <CardTitle>Retirement Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <RetirementInputs 
            inputs={inputs} 
            setInputs={setInputs} 
            formatCurrency={formatCurrency} 
          />
          <RetirementResults 
            projectionData={projectionData} 
            formatCurrency={formatCurrency} 
          />
        </div>

        <div className="mt-8 space-y-4">
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
      </CardContent>
    </Card>
  );
};

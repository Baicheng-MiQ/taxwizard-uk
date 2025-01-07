import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RetirementChart } from './RetirementChart';
import { YearlyData } from '../types/retirement';

interface FullscreenButtonProps {
  yearlyData: YearlyData[];
  formatCurrency: (value: number) => string;
}

export const FullscreenButton = ({ yearlyData, formatCurrency }: FullscreenButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-2 right-2">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh]">
        <div className="h-full w-full pt-4">
          <RetirementChart 
            yearlyData={yearlyData} 
            formatCurrency={formatCurrency} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
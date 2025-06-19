
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  dataInicio?: Date;
  setDataInicio: (date: Date | undefined) => void;
  dataFim?: Date;
  setDataFim: (date: Date | undefined) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  dataInicio, 
  setDataInicio, 
  dataFim, 
  setDataFim 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
      <div className="flex gap-4">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl",
                  !dataInicio && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataInicio ? format(dataInicio, 'dd/MM/yyyy', { locale: ptBR }) : 'Data início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataInicio}
                onSelect={setDataInicio}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl",
                  !dataFim && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataFim ? format(dataFim, 'dd/MM/yyyy', { locale: ptBR }) : 'Data fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataFim}
                onSelect={setDataFim}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

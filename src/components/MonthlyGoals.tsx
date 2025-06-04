
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Plus, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

interface MonthlyGoalsProps {
  totalReceitas: number;
  totalDespesas: number;
  empresa: string;
}

const MonthlyGoals: React.FC<MonthlyGoalsProps> = ({ totalReceitas, totalDespesas, empresa }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Receita Meta',
      target: 1000000, // R$ 10.000,00
      current: totalReceitas,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Controle Custos',
      target: 800000, // R$ 8.000,00
      current: Math.max(0, 800000 - totalDespesas),
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Margem Lucro',
      target: 200000, // R$ 2.000,00
      current: totalReceitas - totalDespesas,
      color: 'bg-yellow-500'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoalName(goal.name);
    setNewGoalTarget((goal.target / 100).toString());
    setIsDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal) {
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { ...goal, name: newGoalName, target: parseFloat(newGoalTarget) * 100 }
          : goal
      ));
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: newGoalName,
        target: parseFloat(newGoalTarget) * 100,
        current: 0,
        color: 'bg-purple-500'
      };
      setGoals([...goals, newGoal]);
    }
    setIsDialogOpen(false);
    setEditingGoal(null);
    setNewGoalName('');
    setNewGoalTarget('');
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setNewGoalName('');
    setNewGoalTarget('');
    setIsDialogOpen(true);
  };

  const getProgress = (current: number, target: number) => {
    return Math.min(100, Math.max(0, (current / target) * 100));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas do Mês
            </CardTitle>
            <CardDescription>Objetivos e progresso</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddGoal}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal.current, goal.target);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{goal.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditGoal(goal)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>R$ {(goal.current / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span>Meta: R$ {(goal.target / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          );
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Edite os detalhes da meta' : 'Adicione uma nova meta para acompanhar'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalName">Nome da Meta</Label>
                <Input
                  id="goalName"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="Ex: Receita Meta"
                />
              </div>
              <div>
                <Label htmlFor="goalTarget">Valor Meta (R$)</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="Ex: 10000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGoal}>
                {editingGoal ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MonthlyGoals;


import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';

interface SavingsGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  frequency: string;
  status: string;
  payments: SavingsPayment[];
}

interface SavingsPayment {
  id: string;
  amount: number;
  status: string;
  scheduledDate: string;
  completedDate?: string;
}

export default function SavingsDashboard() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    targetAmount: '',
    deadline: '',
    frequency: 'MONTHLY',
  });

  const fetchGoals = async () => {
    // Mock data for now
    const mockGoals: SavingsGoal[] = [
      {
        id: '1',
        targetAmount: 1000000,
        currentAmount: 750000,
        deadline: '2024-12-31',
        frequency: 'MONTHLY',
        status: 'ACTIVE',
        payments: []
      }
    ];
    setGoals(mockGoals);
  };

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock creation for now
      console.log('Creating goal:', newGoal);
      fetchGoals();
      setNewGoal({ targetAmount: '', deadline: '', frequency: 'MONTHLY' });
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Savings Goal</h2>
        <form onSubmit={createGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Amount</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              value={newGoal.frequency}
              onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Goal
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Savings Goals</h2>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">
                  ₦{goal.targetAmount.toLocaleString()} - {goal.frequency.toLowerCase()}
                </h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  goal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}>
                  {goal.status}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Due by: {new Date(goal.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Progress: ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

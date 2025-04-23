import React, { useState } from 'react';
import { Process } from '../types';
import { getProcessColor } from '../utils/colors';
import { PlusCircle } from 'lucide-react';

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  processes: Process[];
}

const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess, processes }) => {
  const [name, setName] = useState('');
  const [arrivalTime, setArrivalTime] = useState('0');
  const [burstTime, setBurstTime] = useState('1');
  const [priority, setPriority] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Process name is required');
      return;
    }
    
    if (parseInt(burstTime) <= 0) {
      setError('Burst time must be greater than 0');
      return;
    }
    
    // Check if process name already exists
    if (processes.some(p => p.name === name)) {
      setError('A process with this name already exists');
      return;
    }
    
    const newProcess: Process = {
      id: `p-${Date.now()}`,
      name,
      arrivalTime: parseInt(arrivalTime),
      burstTime: parseInt(burstTime),
      priority: parseInt(priority),
      color: getProcessColor(processes.length),
    };
    
    onAddProcess(newProcess);
    
    // Reset form
    setName('');
    setArrivalTime('0');
    setBurstTime('1');
    setPriority('1');
    setError('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Process</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Process Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="P1"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">
              Arrival Time
            </label>
            <input
              type="number"
              id="arrivalTime"
              min="0"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div>
            <label htmlFor="burstTime" className="block text-sm font-medium text-gray-700">
              Burst Time
            </label>
            <input
              type="number"
              id="burstTime"
              min="1"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <input
              type="number"
              id="priority"
              min="1"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="1 (lower = higher priority)"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Process
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessForm;
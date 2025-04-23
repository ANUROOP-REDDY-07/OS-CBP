import React, { useState } from 'react';
import { SchedulingAlgorithm } from '../types';
import { Info } from 'lucide-react';

interface AlgorithmControlsProps {
  onRunAlgorithm: (algorithm: SchedulingAlgorithm, timeQuantum?: number) => void;
  disableControls: boolean;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({ 
  onRunAlgorithm,
  disableControls
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleRunClick = () => {
    if (selectedAlgorithm === 'Round Robin') {
      onRunAlgorithm(selectedAlgorithm, timeQuantum);
    } else {
      onRunAlgorithm(selectedAlgorithm);
    }
  };
  
  const algorithmInfo = {
    'FCFS': 'First-Come-First-Serve: Processes are executed in the order they arrive. Simple but can lead to poor performance if long processes arrive early.',
    'Priority': 'Priority Scheduling: Processes are executed based on priority values. Lower values indicate higher priority. Can cause starvation for low-priority processes.',
    'Round Robin': 'Round Robin: Each process is assigned a fixed time quantum, and the CPU cycles between them. Good for responsiveness but adds context switching overhead.'
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold mb-2 sm:mb-0">Scheduling Algorithm</h2>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Info className="h-4 w-4 mr-1" />
          {showInfo ? 'Hide Info' : 'Algorithm Info'}
        </button>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
          <h3 className="font-medium mb-2">Algorithm Descriptions:</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">FCFS:</span> {algorithmInfo.FCFS}</li>
            <li><span className="font-medium">Priority:</span> {algorithmInfo.Priority}</li>
            <li><span className="font-medium">Round Robin:</span> {algorithmInfo['Round Robin']}</li>
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center">
          <input
            id="fcfs"
            type="radio"
            name="algorithm"
            value="FCFS"
            checked={selectedAlgorithm === 'FCFS'}
            onChange={() => setSelectedAlgorithm('FCFS')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            disabled={disableControls}
          />
          <label htmlFor="fcfs" className="ml-2 block text-sm font-medium text-gray-700">
            First-Come-First-Serve (FCFS)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="priority"
            type="radio"
            name="algorithm"
            value="Priority"
            checked={selectedAlgorithm === 'Priority'}
            onChange={() => setSelectedAlgorithm('Priority')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            disabled={disableControls}
          />
          <label htmlFor="priority" className="ml-2 block text-sm font-medium text-gray-700">
            Priority Scheduling
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="roundRobin"
            type="radio"
            name="algorithm"
            value="Round Robin"
            checked={selectedAlgorithm === 'Round Robin'}
            onChange={() => setSelectedAlgorithm('Round Robin')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            disabled={disableControls}
          />
          <label htmlFor="roundRobin" className="ml-2 block text-sm font-medium text-gray-700">
            Round Robin
          </label>
        </div>
      </div>
      
      {selectedAlgorithm === 'Round Robin' && (
        <div className="mb-4">
          <label htmlFor="timeQuantum" className="block text-sm font-medium text-gray-700 mb-1">
            Time Quantum
          </label>
          <input
            type="number"
            id="timeQuantum"
            min="1"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
            className="max-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            disabled={disableControls}
          />
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleRunClick}
          disabled={disableControls}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${disableControls ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'} 
            transition duration-150`}
        >
          Run Algorithm
        </button>
      </div>
    </div>
  );
};

export default AlgorithmControls;
import React from 'react';
import { SchedulingResult, SchedulingAlgorithm } from '../types';
import GanttChart from './GanttChart';
import ProcessTable from './ProcessTable';

interface SimulationResultsProps {
  result: SchedulingResult | null;
  algorithm: SchedulingAlgorithm | null;
  timeQuantum?: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  result, 
  algorithm,
  timeQuantum
}) => {
  if (!result || !algorithm) {
    return null;
  }
  
  const formatAlgorithmName = (alg: SchedulingAlgorithm): string => {
    switch (alg) {
      case 'FCFS':
        return 'First-Come-First-Serve (FCFS)';
      case 'Priority':
        return 'Priority Scheduling';
      case 'Round Robin':
        return `Round Robin (Time Quantum: ${timeQuantum})`;
      default:
        return alg;
    }
  };
  
  const formatDecimal = (num: number): string => {
    return num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          {formatAlgorithmName(algorithm)} Results
        </h2>
        
        <GanttChart data={result.ganttChart} height={120} />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Process Statistics</h2>
        <ProcessTable 
          processes={result.processes} 
          onDeleteProcess={() => {}} 
          showMetrics={true}
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Average Waiting Time</p>
            <p className="text-2xl font-semibold text-blue-600">{formatDecimal(result.averageWaitingTime)}</p>
          </div>
          
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Average Turnaround Time</p>
            <p className="text-2xl font-semibold text-teal-600">{formatDecimal(result.averageTurnaroundTime)}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Average Response Time</p>
            <p className="text-2xl font-semibold text-amber-600">{formatDecimal(result.averageResponseTime)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">CPU Utilization</p>
            <p className="text-2xl font-semibold text-green-600">{formatDecimal(result.cpuUtilization)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
import React from 'react';
import { Process } from '../types';
import { getProcessColor } from '../utils/colors';

interface SampleProcessesProps {
  onLoadSample: (processes: Process[]) => void;
}

const SampleProcesses: React.FC<SampleProcessesProps> = ({ onLoadSample }) => {
  const sampleSets = [
    {
      name: 'Basic Set',
      description: 'A simple set of processes with varied arrival times and burst times',
      processes: [
        { name: 'P1', arrivalTime: 0, burstTime: 5, priority: 3 },
        { name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { name: 'P3', arrivalTime: 2, burstTime: 8, priority: 4 },
        { name: 'P4', arrivalTime: 3, burstTime: 2, priority: 2 },
      ]
    },
    {
      name: 'Priority Example',
      description: 'Processes with same arrival times but different priorities',
      processes: [
        { name: 'P1', arrivalTime: 0, burstTime: 7, priority: 2 },
        { name: 'P2', arrivalTime: 0, burstTime: 4, priority: 1 },
        { name: 'P3', arrivalTime: 0, burstTime: 9, priority: 3 },
        { name: 'P4', arrivalTime: 0, burstTime: 3, priority: 4 },
      ]
    },
    {
      name: 'Round Robin Demo',
      description: 'Processes that demonstrate context switching in Round Robin',
      processes: [
        { name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
        { name: 'P2', arrivalTime: 0, burstTime: 4, priority: 1 },
        { name: 'P3', arrivalTime: 0, burstTime: 3, priority: 1 },
        { name: 'P4', arrivalTime: 4, burstTime: 6, priority: 1 },
        { name: 'P5', arrivalTime: 6, burstTime: 2, priority: 1 },
      ]
    }
  ];
  
  const loadSampleSet = (sampleIndex: number) => {
    const sample = sampleSets[sampleIndex];
    
    // Create process objects with IDs and colors
    const processes: Process[] = sample.processes.map((p, index) => ({
      id: `sample-${sampleIndex}-${index}`,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      color: getProcessColor(index)
    }));
    
    onLoadSample(processes);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sample Process Sets</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleSets.map((sample, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition duration-150 cursor-pointer"
            onClick={() => loadSampleSet(index)}
          >
            <h3 className="font-medium text-gray-900 mb-2">{sample.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{sample.description}</p>
            <div className="flex flex-wrap gap-2">
              {sample.processes.map((p, i) => (
                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {p.name} (BT: {p.burstTime})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleProcesses;
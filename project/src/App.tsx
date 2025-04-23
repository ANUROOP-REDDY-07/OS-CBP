import React, { useState } from 'react';
import { Process, SchedulingAlgorithm, SchedulingResult } from './types';
import { fcfs, priorityScheduling, roundRobin } from './utils/schedulingAlgorithms';
import { Cpu } from 'lucide-react';

// Components
import ProcessForm from './components/ProcessForm';
import ProcessTable from './components/ProcessTable';
import AlgorithmControls from './components/AlgorithmControls';
import SimulationResults from './components/SimulationResults';
import SampleProcesses from './components/SampleProcesses';

function App() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [simulationResult, setSimulationResult] = useState<SchedulingResult | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm | null>(null);
  const [timeQuantum, setTimeQuantum] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>(processes.length > 0 ? 'input' : 'input');
  
  const handleAddProcess = (process: Process) => {
    setProcesses(prev => [...prev, process]);
    // Reset simulation results when processes change
    setSimulationResult(null);
    setSelectedAlgorithm(null);
  };
  
  const handleDeleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    // Reset simulation results when processes change
    setSimulationResult(null);
    setSelectedAlgorithm(null);
  };
  
  const handleLoadSample = (sampleProcesses: Process[]) => {
    setProcesses(sampleProcesses);
    // Reset simulation results when processes change
    setSimulationResult(null);
    setSelectedAlgorithm(null);
  };
  
  const handleRunAlgorithm = (algorithm: SchedulingAlgorithm, quantum?: number) => {
    if (processes.length === 0) {
      return; // Don't run with no processes
    }
    
    let result: SchedulingResult;
    
    switch (algorithm) {
      case 'FCFS':
        result = fcfs(processes);
        break;
      case 'Priority':
        result = priorityScheduling(processes);
        break;
      case 'Round Robin':
        result = roundRobin(processes, quantum || 2);
        setTimeQuantum(quantum);
        break;
      default:
        return;
    }
    
    setSimulationResult(result);
    setSelectedAlgorithm(algorithm);
    setActiveTab('results');
  };
  
  // Handle clear all
  const handleClearAll = () => {
    setProcesses([]);
    setSimulationResult(null);
    setSelectedAlgorithm(null);
    setActiveTab('input');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-white mr-3" />
              <h1 className="text-2xl font-bold text-white">CPU Scheduling Simulator</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'input'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('input')}
              >
                Process Input
              </button>
              <button
                className={`${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  !simulationResult ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => simulationResult && setActiveTab('results')}
                disabled={!simulationResult}
              >
                Simulation Results
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'input' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProcessForm onAddProcess={handleAddProcess} processes={processes} />
              
              <div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Process Queue</h2>
                    
                    <button
                      onClick={handleClearAll}
                      className={`text-sm text-red-600 hover:text-red-800 ${processes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={processes.length === 0}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <ProcessTable 
                    processes={processes} 
                    onDeleteProcess={handleDeleteProcess}
                  />
                </div>
              </div>
            </div>
            
            <SampleProcesses onLoadSample={handleLoadSample} />
            
            <AlgorithmControls
              onRunAlgorithm={handleRunAlgorithm}
              disableControls={processes.length === 0}
            />
          </div>
        )}
        
        {activeTab === 'results' && simulationResult && (
          <SimulationResults 
            result={simulationResult} 
            algorithm={selectedAlgorithm}
            timeQuantum={timeQuantum}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-10 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            CPU Scheduling Simulator - A visual demonstration of different scheduling algorithms
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React from 'react';
import { Process } from '../types';
import { Trash2 } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  onDeleteProcess: (id: string) => void;
  showMetrics?: boolean;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ 
  processes, 
  onDeleteProcess,
  showMetrics = false 
}) => {
  if (processes.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No processes added yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Process
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Arrival Time
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Burst Time
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            {showMetrics && (
              <>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finish Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnaround Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiting Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
              </>
            )}
            {!showMetrics && (
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                  <div className="text-sm font-medium text-gray-900">{process.name}</div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {process.arrivalTime}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {process.burstTime}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {process.priority}
              </td>
              {showMetrics && (
                <>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {process.startTime !== undefined ? process.startTime : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {process.completionTime !== undefined ? process.completionTime : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {process.turnaroundTime !== undefined ? process.turnaroundTime : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {process.waitingTime !== undefined ? process.waitingTime : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {process.responseTime !== undefined ? process.responseTime : '-'}
                  </td>
                </>
              )}
              {!showMetrics && (
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDeleteProcess(process.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;
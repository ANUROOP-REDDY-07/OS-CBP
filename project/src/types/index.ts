export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
  remainingTime?: number;
  startTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
}

export interface GanttChartItem {
  processId: string;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
}

export type SchedulingAlgorithm = 'FCFS' | 'Priority' | 'Round Robin';

export interface SchedulingResult {
  ganttChart: GanttChartItem[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
}
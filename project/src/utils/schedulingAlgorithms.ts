import { Process, GanttChartItem, SchedulingResult } from '../types';

// First-Come-First-Serve (FCFS) Algorithm
export const fcfs = (processes: Process[]): SchedulingResult => {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const result = calculateMetrics(sortedProcesses);
  return result;
};

// Priority Scheduling Algorithm (lower number = higher priority)
export const priorityScheduling = (processes: Process[]): SchedulingResult => {
  // Create a deep copy of processes
  const processQueue = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  const completedProcesses: Process[] = [];
  const ganttChart: GanttChartItem[] = [];
  
  let currentTime = 0;
  let idle = false;

  // Continue until all processes are completed
  while (processQueue.length > 0) {
    // Find all processes that have arrived by the current time
    const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No process has arrived yet, move time to the earliest arrival
      const nextArrival = Math.min(...processQueue.map(p => p.arrivalTime));
      
      if (idle === false) {
        ganttChart.push({
          processId: 'idle',
          processName: 'Idle',
          startTime: currentTime,
          endTime: nextArrival,
          color: '#d1d5db' // Gray color for idle time
        });
        idle = true;
      }
      
      currentTime = nextArrival;
      continue;
    }
    
    idle = false;
    
    // Find the process with the highest priority (lowest number)
    const highestPriorityProcess = availableProcesses.reduce(
      (prev, current) => (prev.priority < current.priority ? prev : current)
    );
    
    // Execute the highest priority process
    const processIndex = processQueue.findIndex(p => p.id === highestPriorityProcess.id);
    const process = { ...processQueue[processIndex] };
    
    // Set start time if not set
    if (process.startTime === undefined) {
      process.startTime = currentTime;
      process.responseTime = process.startTime - process.arrivalTime;
    }
    
    // Execute the process completely
    const startExecution = currentTime;
    currentTime += process.remainingTime!;
    process.remainingTime = 0;
    
    // Update completion time and calculate turnaround and waiting time
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    // Add to Gantt chart
    ganttChart.push({
      processId: process.id,
      processName: process.name,
      startTime: startExecution,
      endTime: currentTime,
      color: process.color
    });
    
    // Remove the completed process from queue and add to completed
    processQueue.splice(processIndex, 1);
    completedProcesses.push(process);
  }
  
  const totalTime = ganttChart.reduce((total, item) => total + (item.endTime - item.startTime), 0);
  const nonIdleTime = ganttChart
    .filter(item => item.processId !== 'idle')
    .reduce((total, item) => total + (item.endTime - item.startTime), 0);
  
  const cpuUtilization = totalTime > 0 ? (nonIdleTime / totalTime) * 100 : 0;
  
  // Calculate averages
  const averageWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime!, 0) / completedProcesses.length;
  const averageTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completedProcesses.length;
  const averageResponseTime = completedProcesses.reduce((sum, p) => sum + p.responseTime!, 0) / completedProcesses.length;

  return {
    ganttChart,
    processes: completedProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
    cpuUtilization
  };
};

// Round Robin Algorithm
export const roundRobin = (processes: Process[], timeQuantum: number): SchedulingResult => {
  // Create a deep copy of processes
  const processQueue = [...processes].map(p => ({ 
    ...p, 
    remainingTime: p.burstTime,
    startTime: undefined,
    completionTime: undefined
  }));
  
  const completedProcesses: Process[] = [];
  const ganttChart: GanttChartItem[] = [];
  
  let currentTime = 0;
  
  // Get earliest arrival time
  const earliestArrival = Math.min(...processQueue.map(p => p.arrivalTime));
  
  // If simulation doesn't start at time 0, add idle time
  if (earliestArrival > 0) {
    ganttChart.push({
      processId: 'idle',
      processName: 'Idle',
      startTime: 0,
      endTime: earliestArrival,
      color: '#d1d5db' // Gray color for idle time
    });
    currentTime = earliestArrival;
  }
  
  // Round Robin queue
  let readyQueue: Process[] = [];
  
  // Continue until all processes are completed
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Add newly arrived processes to the ready queue
    const newArrivals = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    readyQueue = [...readyQueue, ...newArrivals];
    
    // Remove new arrivals from process queue
    for (const arrival of newArrivals) {
      const index = processQueue.findIndex(p => p.id === arrival.id);
      if (index !== -1) {
        processQueue.splice(index, 1);
      }
    }
    
    // If ready queue is empty but process queue is not, jump to next arrival
    if (readyQueue.length === 0 && processQueue.length > 0) {
      const nextArrival = Math.min(...processQueue.map(p => p.arrivalTime));
      
      ganttChart.push({
        processId: 'idle',
        processName: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
        color: '#d1d5db' // Gray color for idle time
      });
      
      currentTime = nextArrival;
      continue;
    }
    
    // Execute the first process in the ready queue
    if (readyQueue.length > 0) {
      const currentProcess = readyQueue.shift()!;
      
      // Set start time if not already set (first execution)
      if (currentProcess.startTime === undefined) {
        currentProcess.startTime = currentTime;
        currentProcess.responseTime = currentProcess.startTime - currentProcess.arrivalTime;
      }
      
      // Calculate execution time (minimum of time quantum and remaining time)
      const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);
      
      // Add to Gantt chart
      ganttChart.push({
        processId: currentProcess.id,
        processName: currentProcess.name,
        startTime: currentTime,
        endTime: currentTime + executionTime,
        color: currentProcess.color
      });
      
      // Update current time and remaining time
      currentTime += executionTime;
      currentProcess.remainingTime! -= executionTime;
      
      // Check if process is completed
      if (currentProcess.remainingTime! <= 0) {
        // Process completed
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        
        completedProcesses.push(currentProcess);
      } else {
        // Return process to ready queue if not completed
        // Check for new arrivals before adding back to ready queue
        const newArrivalsBeforeRequeue = processQueue.filter(p => p.arrivalTime <= currentTime);
        
        readyQueue = [...readyQueue, ...newArrivalsBeforeRequeue, currentProcess];
        
        // Remove new arrivals from process queue
        for (const arrival of newArrivalsBeforeRequeue) {
          const index = processQueue.findIndex(p => p.id === arrival.id);
          if (index !== -1) {
            processQueue.splice(index, 1);
          }
        }
      }
    }
  }
  
  const totalTime = ganttChart.reduce((total, item) => total + (item.endTime - item.startTime), 0);
  const nonIdleTime = ganttChart
    .filter(item => item.processId !== 'idle')
    .reduce((total, item) => total + (item.endTime - item.startTime), 0);
  
  const cpuUtilization = totalTime > 0 ? (nonIdleTime / totalTime) * 100 : 0;
  
  // Calculate averages
  const averageWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime!, 0) / completedProcesses.length;
  const averageTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completedProcesses.length;
  const averageResponseTime = completedProcesses.reduce((sum, p) => sum + p.responseTime!, 0) / completedProcesses.length;

  return {
    ganttChart,
    processes: completedProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
    cpuUtilization
  };
};

// Calculate process metrics for FCFS 
const calculateMetrics = (processes: Process[]): SchedulingResult => {
  const resultProcesses = [...processes];
  const ganttChart: GanttChartItem[] = [];
  
  let currentTime = 0;
  
  for (let i = 0; i < resultProcesses.length; i++) {
    const process = resultProcesses[i];
    
    // If there's a gap between the current time and the next process's arrival time,
    // add an idle period to the Gantt chart
    if (process.arrivalTime > currentTime) {
      ganttChart.push({
        processId: 'idle',
        processName: 'Idle',
        startTime: currentTime,
        endTime: process.arrivalTime,
        color: '#d1d5db' // Gray color for idle time
      });
      currentTime = process.arrivalTime;
    }
    
    // Set the start time for this process
    resultProcesses[i].startTime = currentTime;
    resultProcesses[i].responseTime = currentTime - process.arrivalTime;
    
    // Add this process to the Gantt chart
    ganttChart.push({
      processId: process.id,
      processName: process.name,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
      color: process.color
    });
    
    // Update the current time after this process finishes
    currentTime += process.burstTime;
    
    // Set the completion time for this process
    resultProcesses[i].completionTime = currentTime;
    
    // Calculate turnaround time and waiting time
    resultProcesses[i].turnaroundTime = resultProcesses[i].completionTime - process.arrivalTime;
    resultProcesses[i].waitingTime = resultProcesses[i].turnaroundTime - process.burstTime;
  }
  
  const totalTime = ganttChart.reduce((total, item) => total + (item.endTime - item.startTime), 0);
  const nonIdleTime = ganttChart
    .filter(item => item.processId !== 'idle')
    .reduce((total, item) => total + (item.endTime - item.startTime), 0);
  
  const cpuUtilization = totalTime > 0 ? (nonIdleTime / totalTime) * 100 : 0;
  
  // Calculate average waiting time and turnaround time
  const averageWaitingTime = resultProcesses.reduce((sum, p) => sum + p.waitingTime!, 0) / resultProcesses.length;
  const averageTurnaroundTime = resultProcesses.reduce((sum, p) => sum + p.turnaroundTime!, 0) / resultProcesses.length;
  const averageResponseTime = resultProcesses.reduce((sum, p) => sum + p.responseTime!, 0) / resultProcesses.length;
  
  return {
    ganttChart,
    processes: resultProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
    cpuUtilization
  };
};
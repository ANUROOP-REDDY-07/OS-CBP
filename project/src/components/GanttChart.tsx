import React, { useEffect, useRef } from 'react';
import { GanttChartItem } from '../types';

interface GanttChartProps {
  data: GanttChartItem[];
  height?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ data, height = 100 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (data.length === 0) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svg.clientWidth;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find start and end times
    const startTime = Math.min(...data.map(item => item.startTime));
    const endTime = Math.max(...data.map(item => item.endTime));
    const timeRange = endTime - startTime;
    
    // Create scale for x-axis
    const timeToX = (time: number) => {
      return padding.left + (time - startTime) / timeRange * chartWidth;
    };
    
    // Add bars for each process
    const barHeight = chartHeight * 0.6;
    const barY = padding.top + (chartHeight - barHeight) / 2;
    
    // Create group for the chart
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add bars
    data.forEach(item => {
      const barWidth = timeToX(item.endTime) - timeToX(item.startTime);
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', timeToX(item.startTime).toString());
      rect.setAttribute('y', barY.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', item.color);
      rect.setAttribute('stroke', '#ffffff');
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('rx', '4');
      
      // Add animation
      rect.setAttribute('opacity', '0');
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'opacity');
      animate.setAttribute('from', '0');
      animate.setAttribute('to', '1');
      animate.setAttribute('dur', '0.5s');
      animate.setAttribute('fill', 'freeze');
      rect.appendChild(animate);
      
      g.appendChild(rect);
      
      // Only add process name if bar is wide enough
      if (barWidth > 40) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (timeToX(item.startTime) + barWidth / 2).toString());
        text.setAttribute('y', (barY + barHeight / 2 + 5).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', item.processId === 'idle' ? '#4b5563' : '#ffffff');
        text.setAttribute('font-size', '12');
        text.textContent = item.processName;
        
        // Add animation
        text.setAttribute('opacity', '0');
        const animateText = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateText.setAttribute('attributeName', 'opacity');
        animateText.setAttribute('from', '0');
        animateText.setAttribute('to', '1');
        animateText.setAttribute('dur', '0.7s');
        animateText.setAttribute('fill', 'freeze');
        text.appendChild(animateText);
        
        g.appendChild(text);
      }
      
      // Add time labels at start and end of each bar
      const startLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startLabel.setAttribute('x', timeToX(item.startTime).toString());
      startLabel.setAttribute('y', (barY + barHeight + 20).toString());
      startLabel.setAttribute('text-anchor', 'middle');
      startLabel.setAttribute('fill', '#4b5563');
      startLabel.setAttribute('font-size', '10');
      startLabel.textContent = item.startTime.toString();
      g.appendChild(startLabel);
      
      // Only add end time for the last item or if there's a difference in time
      if (item === data[data.length - 1]) {
        const endLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        endLabel.setAttribute('x', timeToX(item.endTime).toString());
        endLabel.setAttribute('y', (barY + barHeight + 20).toString());
        endLabel.setAttribute('text-anchor', 'middle');
        endLabel.setAttribute('fill', '#4b5563');
        endLabel.setAttribute('font-size', '10');
        endLabel.textContent = item.endTime.toString();
        g.appendChild(endLabel);
      }
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width / 2).toString());
    title.setAttribute('y', '15');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#4b5563');
    title.textContent = 'Gantt Chart';
    g.appendChild(title);
    
    svg.appendChild(g);
  }, [data, height]);
  
  return (
    <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <svg 
        ref={svgRef} 
        width="100%" 
        height={height} 
        className="w-full"
        style={{ minWidth: '500px' }}
      />
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Run a scheduling algorithm to see the Gantt chart
        </div>
      )}
    </div>
  );
};

export default GanttChart;
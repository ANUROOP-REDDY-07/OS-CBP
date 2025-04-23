// Predefined colors for processes
export const processColors = [
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#10b981', // Green
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#d946ef'  // Fuchsia
];

// Get a color for a process based on index
export const getProcessColor = (index: number): string => {
  return processColors[index % processColors.length];
};
export const detectCongestion = async (data: any) => {
  // Simple rule-based logic for MVP
  const causes = ['Road Work', 'Accident', 'Heavy Rain', 'Holiday Traffic'];
  const cause = causes[Math.floor(Math.random() * causes.length)];
  
  return {
    detected: true,
    severity: 'High',
    cause,
    affectedNodes: ['B', 'C'],
    warning: `Severe congestion expected at Node B due to ${cause}.`
  };
};

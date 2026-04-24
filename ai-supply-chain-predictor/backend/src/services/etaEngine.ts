export const predictEta = async (data: any) => {
  const baseEta = 24; // hours
  const riskFactor = 1.2;
  
  const optimizedEta = Math.round(baseEta * riskFactor);
  const now = new Date();
  const arrival = new Date(now.getTime() + optimizedEta * 60 * 60 * 1000);
  
  return {
    originalEtaHours: baseEta,
    newEtaHours: optimizedEta,
    estimatedArrival: arrival.toISOString(),
    explanation: 'Adjusted due to a 20% increase in predicted traffic congestion.'
  };
};

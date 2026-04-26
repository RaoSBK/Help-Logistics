export interface EtaPredictionData {
  baseTimeMinutes: number;
  disruptionEvent?: any;
}

export const predictEta = (data: EtaPredictionData) => {
  const baseEta = data.baseTimeMinutes;
  
  let trafficDelay = 0;
  let weatherDelay = 0;
  let congestion = 0;
  
  let explanation = 'Optimal route calculated under current network conditions.';
  let confidence = 95; // base confidence

  if (data.disruptionEvent) {
    confidence = Math.floor(Math.random() * 30) + 60; // 60-90
    if (data.disruptionEvent.type === 'traffic') {
      trafficDelay = (data.disruptionEvent.severityMultiplier || 2) * (Math.random() * 10 + 5) || 50; 
      congestion = (data.disruptionEvent.severityMultiplier || 2) * (Math.random() * 5 + 5) || 25;
      explanation = `Adjusted due to predicted traffic congestion on route ${data.disruptionEvent.from || 'A'} to ${data.disruptionEvent.to || 'B'}.`;
    } else if (data.disruptionEvent.type === 'weather') {
      weatherDelay = (data.disruptionEvent.severityMultiplier || 3) * (Math.random() * 10 + 10) || 75;
      explanation = `Adjusted due to severe weather conditions on route ${data.disruptionEvent.from || 'A'} to ${data.disruptionEvent.to || 'B'}.`;
    } else {
      trafficDelay = Math.random() * 10 + 5;
      explanation = `Rerouted due to ${data.disruptionEvent.type}.`;
    }
  } else {
    // Add some random baseline jitter if no event
    trafficDelay = Math.random() * 5;
    weatherDelay = Math.random() * 2;
    congestion = Math.random() * 10;
  }

  const riskBuffer = Math.round(baseEta * 0.05); 
  const optimizedEtaMinutes = baseEta + trafficDelay + weatherDelay + congestion + riskBuffer;
  
  const now = new Date();
  const arrival = new Date(now.getTime() + optimizedEtaMinutes * 60 * 1000);
  
  return {
    totalEtaMinutes: Math.round(optimizedEtaMinutes),
    breakdown: {
      base: Math.round(baseEta),
      trafficDelay: Math.round(trafficDelay),
      weatherDelay: Math.round(weatherDelay),
      congestion: Math.round(congestion),
      riskBuffer: Math.round(riskBuffer)
    },
    confidence,
    estimatedArrival: arrival.toISOString(),
    explanation
  };
};

/**
 * Mock Gemini Client for MVP
 * Abstract wrapper for future real API integration
 */

export const generateContent = async (prompt: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (prompt.includes('rerouted via')) {
    return 'Due to a severe disruption on the primary route, I have safely rerouted the shipment via the alternate path. This adds some time to the total transit but entirely avoids the blocked segment.';
  }
  
  if (prompt.includes('risk')) {
    return 'Based on current weather and traffic data, there is a moderate risk (45%) of disruption due to heavy rain in the transit corridor.';
  }
  if (prompt.includes('copilot') || prompt.includes('logistics')) {
    return 'I recommend taking the alternate Route B which avoids the expected congestion on Route A, potentially saving you 2 hours and prioritizing safety.';
  }
  
  return 'AI Insights generated successfully. Please consider revising delivery schedules.';
};

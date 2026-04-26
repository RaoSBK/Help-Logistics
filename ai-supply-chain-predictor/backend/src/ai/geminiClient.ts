/**
 * Mock Gemini Client for Hybrid UI MVP
 * Simulates LLM function calling by returning structured JSON.
 */

export const generateStructuredResponse = async (intent: string, state: any, query: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (intent === 'ROUTE_ADVICE' && state.optimalAlternate) {
    return {
      textResponse: `I have analyzed the disruption. Rerouting via ${state.optimalAlternate.route} avoids the ${state.disruption.toLowerCase()} entirely, reducing risk by ${state.optimalAlternate.riskReduction}, though it adds ${state.optimalAlternate.timeImpact} to transit time.`,
      riskLevel: 'LOW',
      recommendation: `Reroute via ${state.optimalAlternate.route}`,
      uiComponent: 'RouteRecommendationWidget',
      uiPayload: {
        originalRoute: state.currentRoute,
        newRoute: state.optimalAlternate.route,
        timeImpact: state.optimalAlternate.timeImpact,
        riskReduction: state.optimalAlternate.riskReduction
      },
      confidenceScore: 0.98
    };
  }
  
  if (intent === 'RISK_INQUIRY') {
    return {
      textResponse: `Shipment is currently flagged as ${state.riskLevel} risk due to an active ${state.disruption}. Immediate rerouting is recommended to avoid severe delays.`,
      riskLevel: state.riskLevel,
      recommendation: 'Evaluate alternate routes',
      uiComponent: 'RiskAssessmentWidget',
      uiPayload: {
        currentRisk: state.riskLevel,
        primaryFactor: state.disruption,
        affectedRoute: state.currentRoute
      },
      confidenceScore: 0.95
    };
  }
  
  // Fallback / General Q&A
  return {
    textResponse: 'Based on current data, your supply chain is operating with some active bottlenecks. How specifically can I assist you with rerouting or risk assessment today?',
    riskLevel: 'MEDIUM',
    recommendation: 'Monitor network',
    uiComponent: null,
    uiPayload: null,
    confidenceScore: 0.8
  };
};

export const generateContent = async (prompt: string): Promise<string> => {
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

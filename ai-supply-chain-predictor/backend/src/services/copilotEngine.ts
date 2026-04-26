import { generateStructuredResponse } from '../ai/geminiClient';

// Deterministic mock data for hybrid reasoning
const MOCK_GRAPH_STATE = {
  'SHP-123': {
    currentRoute: 'Route A',
    riskLevel: 'HIGH',
    disruption: 'Hurricane cell active on I-95',
    optimalAlternate: {
      route: 'Route B',
      timeImpact: '+45 mins',
      riskReduction: '85%'
    }
  },
  'SHP-998': {
    currentRoute: 'Route C',
    riskLevel: 'LOW',
    disruption: 'None',
    optimalAlternate: null
  }
};

export const queryCopilot = async (data: any) => {
  const { query, shipmentDetails } = data;
  const shipmentId = shipmentDetails?.id || 'SHP-123';
  const queryLower = query.toLowerCase();
  
  // 1. Fast-Path Intent Classification
  let intent = 'UNKNOWN';
  if (/alternate|route|safer|reroute/i.test(queryLower)) {
    intent = 'ROUTE_ADVICE';
  } else if (/risk|red|danger|why/i.test(queryLower)) {
    intent = 'RISK_INQUIRY';
  } else if (/bottleneck|network|status/i.test(queryLower)) {
    intent = 'NETWORK_SUMMARY';
  }

  // 2. Context Hydration
  const state = MOCK_GRAPH_STATE[shipmentId as keyof typeof MOCK_GRAPH_STATE] || MOCK_GRAPH_STATE['SHP-123'];

  // 3. LLM Synthesis
  const responsePayload = await generateStructuredResponse(intent, state, query);

  return responsePayload;
};

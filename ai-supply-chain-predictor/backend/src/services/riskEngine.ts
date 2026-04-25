import { generateContent } from '../ai/geminiClient';

interface RiskData {
  route: string;
  weather?: string;
  traffic?: number;
  timeOfDay?: string;
}

export const calculateRiskScore = async (data: RiskData) => {
  // Simulate real risk calculation based on factors
  const { route, weather = 'clear', traffic = 50, timeOfDay = 'day' } = data;

  // Base risk by route (simulate different route complexities)
  const routeRisk = route.length * 5; // Longer routes = higher base risk

  // Weather factor
  const weatherMultiplier = weather === 'stormy' ? 1.5 : weather === 'rainy' ? 1.2 : 1.0;

  // Traffic factor (0-100 scale)
  const trafficRisk = traffic * 0.01; // Convert to 0-1

  // Time factor (rush hour = higher risk)
  const timeRisk = timeOfDay === 'rush' ? 1.3 : 1.0;

  // Calculate weighted score
  const rawScore = (routeRisk + (traffic * 0.4) + (weatherMultiplier * 20) + (timeRisk * 10)) * trafficRisk;
  const score = Math.min(Math.max(Math.round(rawScore), 10), 90); // Clamp 10-90

  const level = score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low';

  const explanation = await generateContent(
    `Explain real risk factors for route ${route} with ${weather} weather, ${traffic}% traffic congestion, and ${timeOfDay} time. Risk score: ${score}.`
  );

  return {
    score,
    level,
    explanation,
    factors: {
      route: Math.round(routeRisk),
      weather: Math.round(weatherMultiplier * 20),
      traffic: Math.round(traffic * 0.4),
      time: Math.round(timeRisk * 10)
    }
  };
};
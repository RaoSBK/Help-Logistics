import { generateContent } from '../ai/geminiClient';

export const calculateRiskScore = async (data: any) => {
  // Mock logic: predict shipment route risk using traffic, weather inputs
  const score = Math.floor(Math.random() * 50) + 20; // 20-70

  const explanation = await generateContent(`Explain risk for shipment ${JSON.stringify(data)}`);

  return {
    score,
    level: score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low',
    explanation
  };
};
import { generateContent } from '../ai/geminiClient';

export const queryCopilot = async (data: any) => {
  const { query, shipmentDetails } = data;
  
  const context = `Shipment details: ${JSON.stringify(shipmentDetails)}. User query: ${query}`;
  const response = await generateContent(context);
  
  return {
    response,
    suggestedActions: ['Reroute to Route C', 'Notify Customer of Delay']
  };
};

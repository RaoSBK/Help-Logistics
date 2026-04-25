interface RiskData {
    route: string;
    weather?: string;
    traffic?: number;
    timeOfDay?: string;
}
export declare const calculateRiskScore: (data: RiskData) => Promise<{
    score: number;
    level: string;
    explanation: string;
    factors: {
        route: number;
        weather: number;
        traffic: number;
        time: number;
    };
}>;
export {};
//# sourceMappingURL=riskEngine.d.ts.map
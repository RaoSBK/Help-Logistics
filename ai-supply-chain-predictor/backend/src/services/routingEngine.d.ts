export declare const findAlternateRoute: (data: any) => Promise<{
    originalRoute: string[];
    alternateRoute: string[];
    metrics: {
        originalEta: number;
        newEta: number;
        delta: string;
    };
    aiExplanation: string;
}>;
//# sourceMappingURL=routingEngine.d.ts.map
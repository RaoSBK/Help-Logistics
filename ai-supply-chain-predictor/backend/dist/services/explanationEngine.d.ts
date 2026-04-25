export interface RouteMetrics {
    originalEta: number;
    newEta: number;
    delta: string;
}
export declare const generateRouteExplanation: (originalRoute: string[], newRoute: string[], metrics: RouteMetrics, disruptionInfo?: any) => Promise<string>;
//# sourceMappingURL=explanationEngine.d.ts.map
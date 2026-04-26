export declare const recomputeRoute: (start: string, end: string, disruptionEvent?: any) => Promise<{
    originalRoute: any;
    alternateRoute: never[];
    metrics: {
        originalEta: any;
        newEta: number;
        delta: string;
    };
    aiExplanation: string;
    disruptionEvent: any;
    graph: {
        node: string;
        edges: import("../algorithms/graph").Edge[];
    }[];
    graphEdges?: never;
} | {
    originalRoute: any;
    alternateRoute: string[];
    metrics: {
        originalEta: any;
        newEta: number;
        delta: string;
    };
    aiExplanation: string;
    disruptionEvent: any;
    graphEdges: {
        node: string;
        edges: import("../algorithms/graph").Edge[];
    }[];
    graph?: never;
}>;
//# sourceMappingURL=routeRecomputeEngine.d.ts.map
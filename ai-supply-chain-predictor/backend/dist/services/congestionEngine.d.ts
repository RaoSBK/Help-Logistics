export interface NodeMetrics {
    id: string;
    load: number;
    throughput: number;
    latency: number;
    packetLoss: number;
    connections: number;
}
export interface EdgeMetrics {
    from: string;
    to: string;
    bandwidth: number;
    utilization: number;
    latency: number;
}
export interface BottleneckResult {
    detected: boolean;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    severityScore: number;
    cause: string;
    affectedNodes: string[];
    bottleneckEdge: {
        from: string;
        to: string;
    } | null;
    criticalPath: string[];
    metrics: {
        avgLatency: number;
        peakLoad: number;
        congestionIndex: number;
        affectedTrafficPct: number;
    };
    recommendation: string;
    warning: string;
    timestamp: number;
}
export declare const detectCongestion: (data: any) => Promise<BottleneckResult>;
//# sourceMappingURL=congestionEngine.d.ts.map
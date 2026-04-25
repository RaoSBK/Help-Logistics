import { Graph } from '../algorithms/graph';
declare class GraphWeightUpdater {
    private graph;
    constructor();
    getGraph(): Graph;
    applyTrafficDelay(from: string, to: string, penalty: number): void;
    applyWeatherPenalty(from: string, to: string, penalty: number): void;
    applyClosure(from: string, to: string): void;
    resetWeights(): void;
}
export declare const graphManager: GraphWeightUpdater;
export {};
//# sourceMappingURL=graphWeightUpdater.d.ts.map
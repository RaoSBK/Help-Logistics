import { Graph } from './graph';
export interface PathResult {
    path: string[];
    distance: number;
}
export declare const runDijkstra: (graph: Graph, startId: string, endId: string) => PathResult;
//# sourceMappingURL=dijkstra.d.ts.map
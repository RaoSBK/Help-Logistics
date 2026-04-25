import { Graph } from './graph';
export interface AStarResult {
    path: string[];
    distance: number;
}
export declare const runAStar: (graph: Graph, startId: string, endId: string) => AStarResult;
//# sourceMappingURL=astar.d.ts.map
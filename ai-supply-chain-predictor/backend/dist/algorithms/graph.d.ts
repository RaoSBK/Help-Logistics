export interface Coordinate {
    x: number;
    y: number;
}
export interface Node {
    id: string;
    name: string;
    coords: Coordinate;
}
export interface Edge {
    from: string;
    to: string;
    weight: number;
    disruptionMultiplier: number;
}
export declare class Graph {
    nodes: Map<string, Node>;
    edges: Map<string, Edge[]>;
    addNode(node: Node): void;
    addEdge(edge: Edge): void;
    getNeighbors(nodeId: string): Edge[];
    getNode(nodeId: string): Node | undefined;
    applyDisruption(from: string, to: string, multiplier: number): void;
}
export declare const createMockNetwork: () => Graph;
//# sourceMappingURL=graph.d.ts.map
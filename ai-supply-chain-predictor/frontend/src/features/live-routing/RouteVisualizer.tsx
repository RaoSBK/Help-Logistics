// Hardcoded coordinates for our mock graph visualization mapping
const nodeCoords: Record<string, { x: number; y: number }> = {
  A: { x: 10, y: 50 },
  B: { x: 40, y: 50 },
  C: { x: 40, y: 80 },
  D: { x: 90, y: 50 },
  E: { x: 70, y: 80 },
};

export default function RouteVisualizer({ routeData }: { routeData: any }) {
  if (!routeData || !routeData.graphEdges) {
    return <div className="h-full flex items-center justify-center text-slate-500">Waiting for graph data...</div>;
  }

  const currentRoute = routeData.alternateRoute || routeData.originalRoute || [];
  
  return (
    <div className="relative w-full h-full min-h-[150px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Draw Edges */}
        {routeData.graphEdges.map((nodeData: any) => 
          nodeData.edges.map((edge: any) => {
            const start = nodeCoords[edge.from];
            const end = nodeCoords[edge.to];
            if (!start || !end) return null;

            const isDisrupted = edge.disruptionMultiplier > 1;
            const isClosed = edge.disruptionMultiplier === Infinity;
            
            // Check if this edge is part of the current active route
            const isActive = currentRoute.includes(edge.from) && currentRoute.includes(edge.to) && 
              Math.abs(currentRoute.indexOf(edge.from) - currentRoute.indexOf(edge.to)) === 1;

            let strokeColor = "rgba(100, 116, 139, 0.3)"; // default slate
            let strokeWidth = "1";
            let strokeDasharray = "none";
            
            if (isClosed) {
                strokeColor = "rgba(239, 68, 68, 0.8)"; // red
                strokeDasharray = "2,2";
            } else if (isDisrupted) {
                strokeColor = "rgba(234, 179, 8, 0.8)"; // yellow
            }

            if (isActive) {
                strokeColor = "rgba(14, 165, 233, 0.8)"; // brand cyan
                strokeWidth = "2";
                if (isDisrupted && !isClosed) strokeColor = "rgba(16, 185, 129, 0.8)"; // green if bypassing disruption
            }

            return (
              <line 
                key={`${edge.from}-${edge.to}`} 
                x1={start.x} y1={start.y} 
                x2={end.x} y2={end.y} 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeDasharray={strokeDasharray}
              />
            );
          })
        )}

        {/* Draw Nodes */}
        {Object.entries(nodeCoords).map(([id, coords]) => (
          <g key={id}>
            <circle 
              cx={coords.x} cy={coords.y} r="4" 
              fill={currentRoute.includes(id) ? "#0ea5e9" : "#1e293b"} 
              stroke={currentRoute.includes(id) ? "#bae6fd" : "#475569"} 
              strokeWidth="1" 
            />
            <text x={coords.x} y={coords.y - 6} fontSize="4" fill="#cbd5e1" textAnchor="middle">{id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

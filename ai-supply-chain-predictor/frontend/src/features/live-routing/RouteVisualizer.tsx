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

            let strokeColor = "rgba(148, 163, 184, 0.4)"; // light slate for inactive
            let strokeWidth = "1.5";
            let strokeDasharray = "none";
            
            if (isClosed) {
                strokeColor = "rgba(239, 68, 68, 0.6)"; // red
                strokeDasharray = "2,2";
            } else if (isDisrupted) {
                strokeColor = "rgba(249, 115, 22, 0.6)"; // orange
            }

            if (isActive) {
                strokeColor = "rgba(59, 130, 246, 1)"; // primary blue for active route
                strokeWidth = "2.5";
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
        {Object.entries(nodeCoords).map(([id, coords]) => {
          let fill = "#cbd5e1"; // default slate-300
          let stroke = "#94a3b8"; // default slate-400
          
          if (id === 'A') {
            fill = "#10b981"; // emerald
            stroke = "#059669";
          } else if (id === 'D') {
            fill = "#ef4444"; // red
            stroke = "#dc2626";
          } else if (currentRoute.includes(id)) {
            fill = "#3b82f6"; // blue
            stroke = "#2563eb";
          }

          // Check if node is disrupted
          const isDisrupted = routeData.graphEdges.some((nd: any) => nd.node === id && nd.edges.some((e: any) => e.disruptionMultiplier > 1));
          if (isDisrupted && id !== 'A' && id !== 'D') {
             fill = "#f97316"; // orange
             stroke = "#ea580c";
          }

          return (
          <g key={id}>
            <circle 
              cx={coords.x} cy={coords.y} r="3.5" 
              fill={fill} 
              stroke={stroke} 
              strokeWidth="1" 
            />
            <text x={coords.x} y={coords.y + 1} fontSize="3" fill="#ffffff" fontWeight="bold" textAnchor="middle">{id}</text>
          </g>
        )})}
      </svg>
    </div>
  );
}

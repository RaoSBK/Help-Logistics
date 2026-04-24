# AI Supply Chain API Spec

## Base URL: `http://localhost:3001/api`

### `POST /risk-score`
Request: `{ route: "A-D" }`
Response: `{ score: 45, level: "Medium", explanation: "..." }`

### `POST /alternate-route`
Request: `{ start: "A", end: "D" }`
Response: `{ originalRoute: ["A", "B"], alternateRoute: ["A", "C"], distance: 100, reason: "..." }`

### `POST /predict-eta`
Request: `{ route_id: "123" }`
Response: `{ originalEtaHours: 24, newEtaHours: 29, estimatedArrival: "...", explanation: "..." }`

### `POST /detect-bottleneck`
Request: `{ region: "North Corridor" }`
Response: `{ detected: true, severity: "High", cause: "...", affectedNodes: [], warning: "..." }`

### `POST /copilot/query`
Request: `{ query: "...", shipmentDetails: {} }`
Response: `{ response: "...", suggestedActions: [] }`

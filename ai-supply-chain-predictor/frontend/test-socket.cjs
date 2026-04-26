const { io } = require("socket.io-client");
const socket = io("http://localhost:3001");
socket.on("connect", () => {
  console.log("Connected");
  socket.emit("start_simulation", { start: "A", end: "D" });
});
socket.on("route_update", (data) => {
  console.log("Received route_update:");
  console.log(JSON.stringify(data.eta, null, 2));
  process.exit(0);
});

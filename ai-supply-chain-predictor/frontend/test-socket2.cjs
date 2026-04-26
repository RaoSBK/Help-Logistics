const { io } = require("socket.io-client");
const socket = io("http://localhost:3001");
socket.on("connect", () => {
  console.log("Connected");
});
socket.on("initial_route", (data) => {
  console.log("Received initial_route:");
  console.log(JSON.stringify(data.eta, null, 2));
  process.exit(0);
});

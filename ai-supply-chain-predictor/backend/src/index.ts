import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import http from 'http';
import { initSockets } from './sockets/routeUpdates';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('AI Supply Chain Disruption Predictor API');
});

const server = http.createServer(app);
initSockets(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

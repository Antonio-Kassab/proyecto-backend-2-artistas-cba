import express from 'express';
import healthRouter from './routes/health.router.js';
import actorsRouter from './routes/actors.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/actors', actorsRouter);
app.use('/api/sessions', sessionsRouter);

export default app;
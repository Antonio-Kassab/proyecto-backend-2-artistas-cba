import express from 'express';
import actorsRouter from './routes/actors.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok", message: "Servidor activo" });
});

// Nuevas rutas para el dominio de actores cordobeses
app.use('/api/actors', actorsRouter);
app.use('/api/sessions', sessionsRouter);

export default app;
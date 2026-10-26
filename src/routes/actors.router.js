import { Router } from 'express';
import { getActors } from '../controllers/actors.controller.js';

const router = Router();

router.get('/', getActors);

export default router;
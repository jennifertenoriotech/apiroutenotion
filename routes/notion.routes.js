import { Router } from 'express';
import {
  listarNotion,
  obtenerNotionPorId,
  crearNotion,
  actualizarNotion,
  eliminarNotion
} from '../controllers/notion.controllers.js';

const router = Router();

router.get('/', listarNotion);
router.get('/:id', obtenerNotionPorId);
router.post('/', crearNotion);
router.put('/:id', actualizarNotion);
router.delete('/:id', eliminarNotion);

export default router;

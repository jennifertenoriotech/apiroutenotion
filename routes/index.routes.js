import { Router } from 'express';
import notionRoutes from './notion.routes.js';

const indexRoutes = Router();

indexRoutes.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Notion Backend funcionando correctamente',
    endpoints: {
      notion: '/api/notion'
    }
  });
});

indexRoutes.use('/notion', notionRoutes);

export default indexRoutes;

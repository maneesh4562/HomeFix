import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getProviderServices,
} from '../controllers/serviceController';
import { auth, isProvider } from '../middleware/auth';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/provider/services', auth, isProvider, getProviderServices);

// Protected routes
router.post('/', auth, isProvider, createService);
router.put('/:id', auth, isProvider, updateService);
router.delete('/:id', auth, isProvider, deleteService);

export default router; 
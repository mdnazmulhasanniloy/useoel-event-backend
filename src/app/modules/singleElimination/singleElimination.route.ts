
import { Router } from 'express';
import { singleEliminationController } from './singleElimination.controller';

const router = Router();

router.post('/', singleEliminationController.createSingleElimination);
router.patch('/:id', singleEliminationController.updateSingleElimination);
router.delete('/:id', singleEliminationController.deleteSingleElimination);
router.get('/:id', singleEliminationController.getSingleEliminationById);
router.get('/', singleEliminationController.getAllSingleElimination);

export const singleEliminationRoutes = router;
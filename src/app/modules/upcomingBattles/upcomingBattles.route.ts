
import { Router } from 'express';
import { upcomingBattlesController } from './upcomingBattles.controller';

const router = Router();

router.post('/', upcomingBattlesController.createUpcomingBattles);
router.patch('/:id', upcomingBattlesController.updateUpcomingBattles);
router.delete('/:id', upcomingBattlesController.deleteUpcomingBattles);
router.get('/:id', upcomingBattlesController.getUpcomingBattlesById);
router.get('/', upcomingBattlesController.getAllUpcomingBattles);

export const upcomingBattlesRoutes = router;
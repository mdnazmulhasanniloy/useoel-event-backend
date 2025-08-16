import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.get(
  '/dashboard-data',
  auth(USER_ROLE.admin),
  dashboardController.getDashboardData,
);
router.get(
  '/dashboard-earning',
  // auth(USER_ROLE.admin),
  dashboardController.getAdminEarning,
);

export const dashboardRoutes = router;

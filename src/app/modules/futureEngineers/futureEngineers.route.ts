import { Router } from 'express';
import { futureEngineersController } from './futureEngineers.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.coach),
  futureEngineersController.createFutureEngineers,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  futureEngineersController.updateFutureEngineers,
);
router.delete('/:id', futureEngineersController.deleteFutureEngineers);
router.get('/:id', futureEngineersController.getFutureEngineersById);
router.get('/', futureEngineersController.getAllFutureEngineers);

export const futureEngineersRoutes = router;

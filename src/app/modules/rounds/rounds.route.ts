import { Router } from 'express';
import { roundsController } from './rounds.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import z from 'zod';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.coach, USER_ROLE.player),
  roundsController.createRounds,
);

router.patch(
  '/review/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  validateRequest(
    z.object({
      body: z.object({
        reviewScore: z.number({ required_error: 'reviewScore is required' }),
      }),
    }),
  ),
  roundsController.updateRounds,
);
router.patch(
  '/:id',
  auth(
    USER_ROLE.coach,
    USER_ROLE.player,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
  ),
  roundsController.updateRounds,
);

router.delete(
  '/:id',
  auth(
    USER_ROLE.coach,
    USER_ROLE.player,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
  ),
  roundsController.deleteRounds,
);

router.get('/:id', roundsController.getRoundsById);

router.get('/', roundsController.getAllRounds);

export const roundsRoutes = router;

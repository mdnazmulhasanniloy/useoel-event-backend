import { Router } from 'express';
import { matchController } from './match.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  matchController.createMatch,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  matchController.updateMatch,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  matchController.deleteMatch,
);
router.get('/:id', matchController.getMatchById);
router.get('/', matchController.getAllMatch);

export const matchRoutes = router;

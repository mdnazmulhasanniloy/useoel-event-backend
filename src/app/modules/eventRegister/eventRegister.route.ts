import { Router } from 'express';
import { eventRegisterController } from './eventRegister.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.coach, USER_ROLE.player),
  eventRegisterController.createEventRegister,
);
router.patch(
  '/accept/:id',
  auth(USER_ROLE.admin),
  eventRegisterController.acceptEventRegister,
);
router.patch(
  '/reject/:id',
  auth(USER_ROLE.admin),
  eventRegisterController.rejectEventRegister,
);
router.patch(
  '/:id',
  auth(USER_ROLE.coach, USER_ROLE.player),
  eventRegisterController.updateEventRegister,
);
router.delete(
  '/:id',
  auth(USER_ROLE.coach, USER_ROLE.player, USER_ROLE.admin),
  eventRegisterController.deleteEventRegister,
);
router.get('/:id', eventRegisterController.getEventRegisterById);
router.get('/', eventRegisterController.getAllEventRegister);

export const eventRegisterRoutes = router;

import { Router } from 'express';
import { participantController } from './participant.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  participantController.createParticipant,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  participantController.updateParticipant,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  participantController.deleteParticipant,
);
router.get('/:id', participantController.getParticipantById);
router.get('/', participantController.getAllParticipant);

export const participantRoutes = router;

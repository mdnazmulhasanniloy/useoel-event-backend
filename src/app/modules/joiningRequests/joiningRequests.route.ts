import { Router } from 'express';
import { joiningRequestsController } from './joiningRequests.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.coach),
  joiningRequestsController.createJoiningRequests,
);

router.patch(
  '/approved/:id',
  auth(USER_ROLE.player),
  joiningRequestsController.approvedRequest,
);

router.patch(
  '/canceled/:id',
  auth(USER_ROLE.player),
  joiningRequestsController.canceledRequest,
);

// router.patch('/:id', joiningRequestsController.updateJoiningRequests);
router.delete(
  '/:id',
  auth(USER_ROLE?.coach),
  joiningRequestsController.deleteJoiningRequests,
);

 
router.get(
  '/request',
  auth(USER_ROLE.player, USER_ROLE.coach),
  joiningRequestsController.getMyTeamJoiningRequests,
);

router.get(
  '/:id',
  auth(USER_ROLE.player, USER_ROLE.coach),
  joiningRequestsController.getJoiningRequestsById,
);
// router.get(
//   '/my-requests',
//   auth(USER_ROLE.player, USER_ROLE.coach),
//   joiningRequestsController.getMyRequests,
// );
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.player, USER_ROLE.coach),
  joiningRequestsController.getAllJoiningRequests,
);

export const joiningRequestsRoutes = router;

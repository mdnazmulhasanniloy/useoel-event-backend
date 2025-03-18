import { Router } from 'express';
import { subscriptionController } from './subscription.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.coach),
  subscriptionController.createSubscription,
);

router.patch(
  '/:id',
  auth(USER_ROLE.coach),
  subscriptionController.updateSubscription,
);

router.delete(
  '/:id',
  auth(USER_ROLE.coach),
  subscriptionController.deleteSubscription,
);

router.get(
  '/user/:userId',
  auth(USER_ROLE.coach, USER_ROLE?.user, USER_ROLE.admin),
  subscriptionController.getSubscriptionByUserId,
);
router.get(
  '/my-subscriptions',
  auth(USER_ROLE.coach),
  subscriptionController.getMySubscription,
);
router.get('/:id', subscriptionController.getSubscriptionById);
router.get('/', subscriptionController.getAllSubscription);

export const subscriptionRoutes = router;

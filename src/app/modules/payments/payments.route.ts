import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/checkout',
  auth(USER_ROLE.service_provider),
  paymentsController.checkout,
);
router.get('/confirm-payment', paymentsController.confirmPayment);
router.get(
  '/dashboard-data',
  auth(USER_ROLE.admin),
  paymentsController.dashboardData,
);
router.get('/earnings', auth(USER_ROLE.admin), paymentsController.getEarnings);
// router.get('/dashboard-data', paymentsController.);
router.post('/', paymentsController.createPayments);

router.patch('/:id', paymentsController.updatePayments);

router.delete('/:id', paymentsController.deletePayments);

router.get('/:id', paymentsController.getPaymentsById);
router.get('/', paymentsController.getAllPayments);

export const paymentsRoutes = router;

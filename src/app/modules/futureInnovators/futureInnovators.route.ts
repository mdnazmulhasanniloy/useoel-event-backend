
import { Router } from 'express';
import { futureInnovatorsController } from './futureInnovators.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.coach), futureInnovatorsController.createFutureInnovators);
router.patch('/:id',auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin), futureInnovatorsController.updateFutureInnovators);
router.delete('/:id', futureInnovatorsController.deleteFutureInnovators);
router.get('/:id', futureInnovatorsController.getFutureInnovatorsById);
router.get('/', futureInnovatorsController.getAllFutureInnovators);

export const futureInnovatorsRoutes = router;
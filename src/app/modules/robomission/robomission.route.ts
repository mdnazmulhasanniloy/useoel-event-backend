
import { Router } from 'express';
import { robomissionController } from './robomission.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.coach), robomissionController.createRobomission);
router.patch('/:id',auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin), robomissionController.updateRobomission);
router.delete('/:id', robomissionController.deleteRobomission);
router.get('/:id', robomissionController.getRobomissionById);
router.get('/', robomissionController.getAllRobomission);

export const robomissionRoutes = router;
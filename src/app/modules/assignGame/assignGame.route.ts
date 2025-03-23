import { Router } from 'express';
import { assignGameController } from './assignGame.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE?.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  assignGameController.createAssignGame,
);
router.patch(
  '/:id',
  auth(USER_ROLE?.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  assignGameController.updateAssignGame,
);
router.delete(
  '/:id',
  auth(USER_ROLE?.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  assignGameController.deleteAssignGame,
);
router.get('/:id', assignGameController.getAssignGameById);
router.get('/', assignGameController.getAllAssignGame);

export const assignGameRoutes = router;

import { Router } from 'express';
import { teamController } from './team.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { teamValidationSchema } from './team.validation';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.coach),
  upload.single('logo'),
  parseData(),
  validateRequest(teamValidationSchema.createTeamSchema),
  teamController.createTeam,
);

router.patch(
  '/add-player',
  auth(USER_ROLE.coach),
  teamController.addPlayerInTeam,
);

router.patch(
  '/remove-player',
  auth(USER_ROLE.coach),
  validateRequest(teamValidationSchema.removePlayerSchema),
  teamController.removePlayerFromTeam,
);

router.patch(
  '/:id',
  auth(USER_ROLE.coach),
  upload.single('logo'),
  parseData(),
  validateRequest(teamValidationSchema.updateTeamSchema),
  teamController.updateTeam,
);

router.delete('/:id', auth(USER_ROLE.coach), teamController.deleteTeam);
router.get('/:id', teamController.getTeamById);
router.get('/', teamController.getAllTeam);

export const teamRoutes = router;

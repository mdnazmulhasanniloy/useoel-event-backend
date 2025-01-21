import { Router } from 'express';
import { teamController } from './team.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.team), teamController.createTeam);
router.patch(
  '/add-player',
  auth(USER_ROLE.team),
  teamController.addPlayerInTeam,
);
router.patch(
  '/remove-player',
  auth(USER_ROLE.team),
  teamController.removePlayerFromTeam,
);
router.patch('/:id', auth(USER_ROLE.team), teamController.updateTeam);
router.delete('/:id', auth(USER_ROLE.team), teamController.deleteTeam);
router.get('/:id', teamController.getTeamById);
router.get('/', teamController.getAllTeam);

export const teamRoutes = router;

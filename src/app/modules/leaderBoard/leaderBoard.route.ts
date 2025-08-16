import { Router } from 'express';
import { leaderBoardController } from './leaderBoard.controller';

const router = Router();

router.get('/:eventId', leaderBoardController.getLeaderBoardByEventId);
// router.get('/', leaderBoardController.getAllLeaderBoard);

export const leaderBoardRoutes = router;

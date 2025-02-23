import { Router } from 'express';
import { matchHighlightsController } from './matchHighlights.controller';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.single('video'),
  parseData(),
  matchHighlightsController.createMatchHighlights,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  upload.single('video'),
  parseData(),
  matchHighlightsController.updateMatchHighlights,
);
router.delete('/:id', auth(USER_ROLE.admin), matchHighlightsController.deleteMatchHighlights);
router.get('/:id', matchHighlightsController.getMatchHighlightsById);
router.get('/', matchHighlightsController.getAllMatchHighlights);

export const matchHighlightsRoutes = router;

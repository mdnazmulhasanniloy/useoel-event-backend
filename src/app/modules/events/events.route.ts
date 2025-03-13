import { Router } from 'express';
import { eventsController } from './events.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { eventValidator } from './events.validation';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  upload.single('image'),
  parseData(),
  validateRequest(eventValidator.createEventSchema),
  eventsController.createEvents,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  upload.single('image'),
  parseData(),
  validateRequest(eventValidator.updateEventSchema),
  eventsController.updateEvents,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  eventsController.deleteEvents,
);
router.get('/:id', eventsController.getEventsById);
router.get('/', eventsController.getAllEvents);

export const eventsRoutes = router;

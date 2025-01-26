
import { Router } from 'express';
import { eventsController } from './events.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single("image"),parseData(), eventsController.createEvents);
router.patch(
  '/:id',
  upload.single('image'),
  parseData(),
  eventsController.updateEvents,
);
router.delete('/:id', eventsController.deleteEvents);
router.get('/:id', eventsController.getEventsById);
router.get('/', eventsController.getAllEvents);

export const eventsRoutes = router;
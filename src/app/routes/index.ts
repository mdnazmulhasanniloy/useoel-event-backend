import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { teamRoutes } from '../modules/team/team.route';
import uploadRouter from '../modules/uploads/route';
import { eventsRoutes } from '../modules/events/events.route';
import { eventRegisterRoutes } from '../modules/eventRegister/eventRegister.route';
import { robomissionRoutes } from '../modules/robomission/robomission.route';
import { roundsRoutes } from '../modules/rounds/rounds.route';
import { futureInnovatorsRoutes } from '../modules/futureInnovators/futureInnovators.route';
import { futureEngineersRoutes } from '../modules/futureEngineers/futureEngineers.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/uploads',
    route: uploadRouter,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/teams',
    route: teamRoutes,
  },
  {
    path: '/events',
    route: eventsRoutes,
  },
  {
    path: '/events-register',
    route: eventRegisterRoutes,
  },
  {
    path: '/robomission',
    route: robomissionRoutes,
  },
  {
    path: '/future-innovators',
    route: futureInnovatorsRoutes,
  },
  {
    path: '/future-engineers',
    route: futureEngineersRoutes,
  },
  {
    path: '/rounds',
    route: roundsRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;

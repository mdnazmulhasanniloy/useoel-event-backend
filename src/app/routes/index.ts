import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { teamRoutes } from '../modules/team/team.route';
import uploadRouter from '../modules/uploads/route';

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
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;

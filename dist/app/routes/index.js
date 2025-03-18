"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const notificaiton_route_1 = require("../modules/notification/notificaiton.route");
const team_route_1 = require("../modules/team/team.route");
const route_1 = __importDefault(require("../modules/uploads/route"));
const events_route_1 = require("../modules/events/events.route");
const eventRegister_route_1 = require("../modules/eventRegister/eventRegister.route");
const robomission_route_1 = require("../modules/robomission/robomission.route");
const rounds_route_1 = require("../modules/rounds/rounds.route");
const futureInnovators_route_1 = require("../modules/futureInnovators/futureInnovators.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/uploads',
        route: route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/otp',
        route: otp_routes_1.otpRoutes,
    },
    {
        path: '/notifications',
        route: notificaiton_route_1.notificationRoutes,
    },
    {
        path: '/teams',
        route: team_route_1.teamRoutes,
    },
    {
        path: '/events',
        route: events_route_1.eventsRoutes,
    },
    {
        path: '/events-register',
        route: eventRegister_route_1.eventRegisterRoutes,
    },
    {
        path: '/robomission',
        route: robomission_route_1.robomissionRoutes,
    },
    {
        path: '/future-innovators',
        route: futureInnovators_route_1.futureInnovatorsRoutes,
    },
    {
        path: '/rounds',
        route: rounds_route_1.roundsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;

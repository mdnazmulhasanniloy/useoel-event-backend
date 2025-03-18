"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchableFields = exports.Role = exports.GENDER = exports.SIGN_UP_STYLE = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    super_admin: 'super_admin',
    sub_admin: 'sub_admin',
    admin: 'admin',
    user: 'user',
    player: 'player',
    coach: 'coach',
    team: 'team',
};
exports.SIGN_UP_STYLE = {
    credentials: 'credentials',
    google: 'google',
    apple: 'apple',
};
var GENDER;
(function (GENDER) {
    GENDER["male"] = "Male";
    GENDER["female"] = "Female";
    GENDER["others"] = "Others";
})(GENDER || (exports.GENDER = GENDER = {}));
exports.Role = [
    'admin',
    'super_admin',
    'sub_admin',
    'user',
    'player',
    'coach',
    'team',
];
exports.userSearchableFields = ['shopId', 'email'];

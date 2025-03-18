"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = exports.CATEGORY_NAME = exports.EVENT_STATUS = void 0;
var EVENT_STATUS;
(function (EVENT_STATUS) {
    EVENT_STATUS["CONTINUE"] = "continue";
    EVENT_STATUS["UPCOMING"] = "upcoming";
    EVENT_STATUS["CANCELLED"] = "cancelled";
    EVENT_STATUS["COMPLETE"] = "complete";
})(EVENT_STATUS || (exports.EVENT_STATUS = EVENT_STATUS = {}));
var CATEGORY_NAME;
(function (CATEGORY_NAME) {
    CATEGORY_NAME["roboMission"] = "RoboMission";
    CATEGORY_NAME["futureInnovators"] = "FutureInnovators";
    CATEGORY_NAME["futureEngineers"] = "Future Engineers";
    CATEGORY_NAME["robosporst"] = "Robosporst";
    CATEGORY_NAME["sumboBots"] = "SumboBots";
})(CATEGORY_NAME || (exports.CATEGORY_NAME = CATEGORY_NAME = {}));
exports.category = [
    'RoboMission',
    'FutureInnovators',
    'Future Engineers',
    'Robosporst',
    'SumboBots',
];

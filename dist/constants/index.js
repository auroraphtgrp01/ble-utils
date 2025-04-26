"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.DATA_SLEEP_TYPE = {
    awake: 244,
    deepSleep: 241,
    lightSleep: 242,
    naps: 245,
    rem: 243,
    unknow: -1,
};
Constants.DATA_UNPACK_TYPE = {
    sportHistory: 2,
    sleepHistory: 4,
    heartHistory: 6,
    bloodPressureHistory: 8,
    comprehensiveMeasurement: 9
};

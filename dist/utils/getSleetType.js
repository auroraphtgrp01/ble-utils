"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSleetType = void 0;
const constants_1 = require("../constants");
const getSleetType = (type) => {
    const sleepType = constants_1.Constants.DATA_SLEEP_TYPE;
    switch (type) {
        case sleepType.awake:
            return 'awake';
        case sleepType.deepSleep:
            return 'deepSleep';
        case sleepType.lightSleep:
            return 'lightSleep';
        case sleepType.naps:
            return 'naps';
        case sleepType.rem:
            return 'rem';
        default:
            return 'unknow';
    }
};
exports.getSleetType = getSleetType;

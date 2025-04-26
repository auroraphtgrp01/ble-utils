"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackSleepData = void 0;
const data_1 = require("../data/data");
const getFinalSleepData_1 = require("../utils/getFinalSleepData");
const unpack_1 = require("../utils/unpack");
const unpackSleepData = (byteArr) => {
    const dataType = data_1.dataTypeForSleep;
    const rawData = (0, unpack_1.unpackHealthData)((0, data_1.hexStringToUint8Array)(byteArr), dataType);
    return (0, getFinalSleepData_1.getFinalSleepData)(rawData);
};
exports.unpackSleepData = unpackSleepData;

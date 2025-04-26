"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackHeartHistoryData = void 0;
const constants_1 = require("../constants");
const data_1 = require("../data/data");
const unpack_1 = require("../utils/unpack");
const unpackHeartHistoryData = (byteArr) => {
    const rawData = (0, unpack_1.unpackHealthData)((0, data_1.hexStringToUint8Array)(byteArr), constants_1.Constants.DATA_UNPACK_TYPE.heartHistory);
    return rawData;
};
exports.unpackHeartHistoryData = unpackHeartHistoryData;

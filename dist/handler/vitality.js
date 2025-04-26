"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackVitalityData = void 0;
const data_1 = require("../data/data");
const unpack_1 = require("../utils/unpack");
const unpackVitalityData = (byteArr) => {
    const dataType = data_1.dataType8;
    const rawData = (0, unpack_1.unpackHealthData)((0, data_1.hexStringToUint8Array)(byteArr), dataType);
    return rawData;
};
exports.unpackVitalityData = unpackVitalityData;

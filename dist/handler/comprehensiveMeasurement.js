"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackComprehensiveMeasurementHistoryData = void 0;
const constants_1 = require("../constants");
const data_1 = require("../data/data");
const unpack_1 = require("../utils/unpack");
const unpackComprehensiveMeasurementHistoryData = (byteArr) => {
    const rawData = (0, unpack_1.unpackHealthData)((0, data_1.hexStringToUint8Array)(byteArr), constants_1.Constants.DATA_UNPACK_TYPE.comprehensiveMeasurement);
    if (rawData && rawData.data && Array.isArray(rawData.data)) {
        delete rawData.code;
        rawData.data = rawData.data.map(item => {
            const { bodyFatIntValue, bodyFatFloatValue, bloodSugarValue } = item, rest = __rest(item, ["bodyFatIntValue", "bodyFatFloatValue", "bloodSugarValue"]);
            return rest;
        });
    }
    return rawData;
};
exports.unpackComprehensiveMeasurementHistoryData = unpackComprehensiveMeasurementHistoryData;

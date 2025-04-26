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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackComprehensiveMeasurementHistoryData = void 0;
const constants_1 = require("../constants");
const hexStringToUint8Array_1 = __importDefault(require("../utils/hexStringToUint8Array"));
const unpack_1 = require("../utils/unpack");
const unpackComprehensiveMeasurementHistoryData = (byteArr) => {
    const rawData = (0, unpack_1.unpackHealthData)((0, hexStringToUint8Array_1.default)(byteArr), constants_1.Constants.DATA_UNPACK_TYPE.comprehensiveMeasurement);
    if (rawData && rawData.data && Array.isArray(rawData.data)) {
        delete rawData.code;
        rawData.data = rawData.data.map(item => {
            const { bodyFatIntValue, bodyFatFloatValue, bloodSugarValue } = item, rest = __rest(item, ["bodyFatIntValue", "bodyFatFloatValue", "bloodSugarValue"]);
            return rest;
        });
        const overview = {
            stepValueAvg: 0,
            heartValueAvg: 0,
            DBPValueAvg: 0,
            SBPValueAvg: 0,
            OOValueAvg: 0,
            respiratoryRateValueAvg: 0,
            hrvValueAvg: 0,
            cvrrValueAvg: 0,
            tempIntValueAvg: 0,
            tempFloatValueAvg: 0
        };
        if (rawData.data.length > 0) {
            const dataCount = rawData.data.length;
            rawData.data.forEach((item) => {
                overview.stepValueAvg += item.stepValue || 0;
                overview.heartValueAvg += item.heartValue || 0;
                overview.DBPValueAvg += item.DBPValue || 0;
                overview.SBPValueAvg += item.SBPValue || 0;
                overview.OOValueAvg += item.OOValue || 0;
                overview.respiratoryRateValueAvg += item.respiratoryRateValue || 0;
                overview.hrvValueAvg += item.hrvValue || 0;
                overview.cvrrValueAvg += item.cvrrValue || 0;
                overview.tempIntValueAvg += item.tempIntValue || 0;
                overview.tempFloatValueAvg += item.tempFloatValue || 0;
            });
            for (const key in overview) {
                if (Object.prototype.hasOwnProperty.call(overview, key)) {
                    overview[key] = Math.round((overview[key] / dataCount) * 100) / 100;
                }
            }
        }
        rawData.overview = overview;
    }
    return rawData;
};
exports.unpackComprehensiveMeasurementHistoryData = unpackComprehensiveMeasurementHistoryData;

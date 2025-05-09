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
exports.unpackBloodPressureData = void 0;
const constants_1 = require("../constants");
const hexStringToUint8Array_1 = __importDefault(require("../utils/hexStringToUint8Array"));
const unpack_1 = require("../utils/unpack");
const unpackBloodPressureData = (byteArr) => {
    const rawData = (0, unpack_1.unpackHealthData)((0, hexStringToUint8Array_1.default)(byteArr), constants_1.Constants.DATA_UNPACK_TYPE.bloodPressureHistory);
    // Tính giá trị trung bình
    if (rawData.data && Array.isArray(rawData.data) && rawData.data.length > 0) {
        let totalSBP = 0;
        let totalDBP = 0;
        let count = rawData.data.length;
        const processedData = rawData.data.map((item) => {
            const { isInflated } = item, rest = __rest(item, ["isInflated"]);
            return rest;
        });
        rawData.data.forEach((item) => {
            totalSBP += item.bloodSBP;
            totalDBP += item.bloodDBP;
        });
        const avgSBP = Math.round(totalSBP / count);
        const avgDBP = Math.round(totalDBP / count);
        return {
            averageData: {
                avgSBP,
                avgDBP
            },
            historyData: processedData
        };
    }
    return {
        historyData: [],
        averageData: {
            avgSBP: 0,
            avgDBP: 0
        }
    };
};
exports.unpackBloodPressureData = unpackBloodPressureData;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackHeartHistoryData = void 0;
const constants_1 = require("../constants");
const hexStringToUint8Array_1 = __importDefault(require("../utils/hexStringToUint8Array"));
const unpack_1 = require("../utils/unpack");
const unpackHeartHistoryData = (byteArr) => {
    const rawData = (0, unpack_1.unpackHealthData)((0, hexStringToUint8Array_1.default)(byteArr), constants_1.Constants.DATA_UNPACK_TYPE.heartHistory);
    return rawData;
};
exports.unpackHeartHistoryData = unpackHeartHistoryData;

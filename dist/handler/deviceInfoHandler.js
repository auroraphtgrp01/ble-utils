"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackDeviceInfo = void 0;
const hexStringToUint8Array_1 = __importDefault(require("../utils/hexStringToUint8Array"));
const unpack_1 = require("../utils/unpack");
const unpackDeviceInfo = (byteArr) => {
    const rawData = (0, unpack_1.unpackDeviceInfoData)((0, hexStringToUint8Array_1.default)(byteArr));
    return {
        deviceId: rawData.data.deviceId,
        deviceVersion: rawData.data.deviceVersion,
        deviceBatteryState: rawData.data.deviceBatteryState,
        deviceBatteryValue: rawData.data.deviceBatteryValue,
    };
};
exports.unpackDeviceInfo = unpackDeviceInfo;

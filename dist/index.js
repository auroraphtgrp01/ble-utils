"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data/data");
const heart_1 = require("./handler/heart");
// console.log(JSON.stringify(unpackSportHistoryData(mockSportHex), null, 2)) // 2
// console.log(JSON.stringify(unpackSleepData(mockSleepingDataHex), null, 2)) // 4
console.log(JSON.stringify((0, heart_1.unpackHeartHistoryData)(data_1.mockHeartHex), null, 2)); // 4
// console.log(JSON.stringify(unpackBloodPressureData(mockBloodPressureHex), null, 2)) // 8
// console.log(JSON.stringify(unpackComprehensiveMeasurementHistoryData(mockComprehensiveMeasurementHex), null, 2)) // 9

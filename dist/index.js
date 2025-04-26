"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleep_1 = require("./handler/sleep");
const data_1 = require("./data/data");
console.log(JSON.stringify((0, sleep_1.unpackSleepData)(data_1.mockSleepingDataHex), null, 2)); // 4
// console.log(JSON.stringify(unpackSportHistoryData(mockSportHex), null, 2)) // 2
// console.log(JSON.stringify(unpackBloodPressureData(mockBloodPressureHex), null, 2)) // 8
// console.log(JSON.stringify(unpackComprehensiveMeasurementHistoryData(mockComprehensiveMeasurementHex), null, 2)) // 9

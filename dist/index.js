"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data/data");
const sleep_1 = require("./handler/sleep");
// const dataType = dataTypeForSleep;
// const byteArray = sleepingDataHex
// const result = unpackHealthData(hexStringToUint8Array(byteArray), dataType);
// // console.log(JSON.stringify(result, null, 2));
// console.log(JSON.stringify(getFinalSleepData(result as SleepData), null, 2));
console.log(JSON.stringify((0, sleep_1.unpackSleepData)(data_1.sleepingDataHex), null, 2));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data/data");
const bloodPressure_1 = require("./handler/bloodPressure");
// const dataType = dataTypeForSleep;
// const byteArray = sleepingDataHex
// const result = unpackHealthData(hexStringToUint8Array(byteArray), dataType);
// // console.log(JSON.stringify(result, null, 2));
// console.log(JSON.stringify(getFinalSleepData(result as SleepData), null, 2));
// console.log(JSON.stringify(unpackSleepData(sleepingDataHex), null, 2))
console.log(JSON.stringify((0, bloodPressure_1.unpackBloodPressureData)(data_1.healthType8Hex), null, 2));

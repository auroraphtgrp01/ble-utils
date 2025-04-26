"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const unpack_1 = require("./unpack");
const dataType = data_1.dataTypeForSleep;
const byteArray = data_1.sleepingDataHex;
const result = (0, unpack_1.unpackHealthData)((0, data_1.hexStringToUint8Array)(byteArray), dataType);
console.log(JSON.stringify(result, null, 2));

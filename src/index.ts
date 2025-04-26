import { dataType2, dataTypeForSleep, healthType8Hex, hexStringToUint8Array, mockComprehensiveMeasurementHex, sleepingDataHex, sportType2Hex } from "./data/data";
import { SleepData } from "./types/sleep";
import { unpackHealthData } from "./utils/unpack";
import { getFinalSleepData } from "./utils/getFinalSleepData";
import { unpackSleepData } from "./handler/sleep";
import { unpackBloodPressureData } from "./handler/bloodPressure";
import { unpackSportHistoryData } from "./handler/sport";
import { unpackComprehensiveMeasurementHistoryData } from "./handler/comprehensiveMeasurement";

// const dataType = dataTypeForSleep;
// const byteArray = sleepingDataHex

// const result = unpackHealthData(hexStringToUint8Array(byteArray), dataType);

// // console.log(JSON.stringify(result, null, 2));

// console.log(JSON.stringify(getFinalSleepData(result as SleepData), null, 2));

// console.log(JSON.stringify(unpackSleepData(sleepingDataHex), null, 2))

console.log(JSON.stringify(unpackComprehensiveMeasurementHistoryData(mockComprehensiveMeasurementHex), null, 2))


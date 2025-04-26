import { dataType2, dataTypeForSleep, hexStringToUint8Array, sleepingDataHex, sportType2Hex } from "./data/data";
import { SleepData } from "./types/sleep";
import { unpackHealthData } from "./utils/unpack";
import { getFinalSleepData } from "./utils/getFinalSleepData";
import { unpackSleepData } from "./handler/sleep";

// const dataType = dataTypeForSleep;
// const byteArray = sleepingDataHex

// const result = unpackHealthData(hexStringToUint8Array(byteArray), dataType);

// // console.log(JSON.stringify(result, null, 2));

// console.log(JSON.stringify(getFinalSleepData(result as SleepData), null, 2));

console.log(JSON.stringify(unpackSleepData(sleepingDataHex), null, 2))

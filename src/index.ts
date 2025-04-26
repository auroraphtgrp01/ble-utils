import { dataType2, dataTypeForSleep, hexStringToUint8Array, sleepingDataHex, sportType2Hex } from "./data";
import { unpackHealthData } from "./unpack";

const dataType = dataTypeForSleep;
const byteArray = sleepingDataHex

const result = unpackHealthData(hexStringToUint8Array(byteArray), dataType);

console.log(JSON.stringify(result, null, 2));

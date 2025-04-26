import { dataTypeForSleep, hexStringToUint8Array, sleepingDataHex } from "../data/data";
import { SleepData } from "../types/sleep";
import { getFinalSleepData } from "../utils/getFinalSleepData";
import { unpackHealthData } from "../utils/unpack";

export const unpackSleepData = (
    byteArr: any
) => {
    const dataType = dataTypeForSleep;
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), dataType);
    return getFinalSleepData(rawData as SleepData);
}
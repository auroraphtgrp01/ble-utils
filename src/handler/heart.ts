import { Constants } from "../constants";
import { dataTypeForSleep, hexStringToUint8Array, sleepingDataHex } from "../data/data";
import { SleepData } from "../types/sleep";
import { getFinalSleepData } from "../utils/getFinalSleepData";
import { unpackHealthData } from "../utils/unpack";

export const unpackHeartHistoryData = (
    byteArr: any
) => {
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), Constants.DATA_UNPACK_TYPE.heartHistory);
    return rawData
}
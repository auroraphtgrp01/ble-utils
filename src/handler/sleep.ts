import { Constants } from "../constants";
import { SleepData } from "../types/sleep";
import { getFinalSleepData } from "../utils/getFinalSleepData";
import hexStringToUint8Array from "../utils/hexStringToUint8Array";
import { unpackHealthData } from "../utils/unpack";

export const unpackSleepData = (
    byteArr: any
) => {
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), Constants.DATA_UNPACK_TYPE.sleepHistory);
    return getFinalSleepData(rawData as SleepData);
}
import { Constants } from "../constants";
import hexStringToUint8Array from "../utils/hexStringToUint8Array";
import { unpackHealthData } from "../utils/unpack";

export const unpackHeartHistoryData = (
    byteArr: any
) => {
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), Constants.DATA_UNPACK_TYPE.heartHistory);

    if (rawData.data && Array.isArray(rawData.data)) {
        const heartRateAvg = rawData.data.reduce((sum, item) => sum + item.heartValue, 0) / rawData.data.length;

        return {
            avgHeartRate: Math.round(heartRateAvg),
            data: rawData.data
        };
    }

    return { data: [], avgHeartRate: 0 };
}
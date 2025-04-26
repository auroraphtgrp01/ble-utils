import { Constants } from "../constants";
import { hexStringToUint8Array } from "../data/data";
import { unpackHealthData } from "../utils/unpack";

export const unpackComprehensiveMeasurementHistoryData = (
    byteArr: any
) => {
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), Constants.DATA_UNPACK_TYPE.comprehensiveMeasurement);
    if (rawData && rawData.data && Array.isArray(rawData.data)) {
        delete rawData.code;

        rawData.data = rawData.data.map(item => {
            const { bodyFatIntValue, bodyFatFloatValue, bloodSugarValue, ...rest } = item;
            return rest;
        });
    }
    return rawData;
}
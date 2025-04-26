import { Constants } from "../constants";
import hexStringToUint8Array from "../utils/hexStringToUint8Array";
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

        const overview = {
            stepValueAvg: 0,
            heartValueAvg: 0,
            DBPValueAvg: 0,
            SBPValueAvg: 0,
            OOValueAvg: 0,
            respiratoryRateValueAvg: 0,
            hrvValueAvg: 0,
            cvrrValueAvg: 0,
            tempIntValueAvg: 0,
            tempFloatValueAvg: 0
        };

        if (rawData.data.length > 0) {
            const dataCount = rawData.data.length;

            rawData.data.forEach((item: Record<string, number>) => {
                overview.stepValueAvg += item.stepValue || 0;
                overview.heartValueAvg += item.heartValue || 0;
                overview.DBPValueAvg += item.DBPValue || 0;
                overview.SBPValueAvg += item.SBPValue || 0;
                overview.OOValueAvg += item.OOValue || 0;
                overview.respiratoryRateValueAvg += item.respiratoryRateValue || 0;
                overview.hrvValueAvg += item.hrvValue || 0;
                overview.cvrrValueAvg += item.cvrrValue || 0;
                overview.tempIntValueAvg += item.tempIntValue || 0;
                overview.tempFloatValueAvg += item.tempFloatValue || 0;
            });

            for (const key in overview) {
                if (Object.prototype.hasOwnProperty.call(overview, key)) {
                    overview[key as keyof typeof overview] = Math.round((overview[key as keyof typeof overview] / dataCount) * 100) / 100;
                }
            }
        }

        rawData.overview = overview;
    }
    return rawData;
}
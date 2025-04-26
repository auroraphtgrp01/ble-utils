import { Constants } from "../constants";
import hexStringToUint8Array from "../utils/hexStringToUint8Array";
import { unpackHealthData } from "../utils/unpack";

export const unpackBloodPressureData = (byteArr: any) => {
    const rawData = unpackHealthData(hexStringToUint8Array(byteArr), Constants.DATA_UNPACK_TYPE.bloodPressureHistory);

    // Tính giá trị trung bình
    if (rawData.data && Array.isArray(rawData.data) && rawData.data.length > 0) {
        let totalSBP = 0;
        let totalDBP = 0;
        let count = rawData.data.length;

        const processedData = rawData.data.map((item: any) => {
            const { isInflated, ...rest } = item;
            return rest;
        });

        rawData.data.forEach((item: any) => {
            totalSBP += item.bloodSBP;
            totalDBP += item.bloodDBP;
        });

        const avgSBP = Math.round(totalSBP / count);
        const avgDBP = Math.round(totalDBP / count);

        return {
            averageData: {
                avgSBP,
                avgDBP
            },
            historyData: processedData
        };
    }

    return {
        historyData: [],
        averageData: {
            avgSBP: 0,
            avgDBP: 0
        }
    };
}
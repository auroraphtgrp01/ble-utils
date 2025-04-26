import { FinalSleepData, GroupedSleepStage, SleepData, SleepItem, SleepOverview } from "../types/sleep";

function groupSleepData(sleepData: SleepItem[]): GroupedSleepStage[] {
    const result: GroupedSleepStage[] = [];
    const typeMap: Record<number, GroupedSleepStage> = {};

    for (const item of sleepData) {
        if (!typeMap[item.sleepType]) {
            typeMap[item.sleepType] = {
                sleepType: item.type,
                totalMinutes: 0,
                stageTime: []
            };
            result.push(typeMap[item.sleepType]);
        }

        typeMap[item.sleepType].stageTime.push({
            startTime: item.sleepStartTime,
            sleepLen: item.sleepLen
        });
        // Cộng dồn thời gian ngủ (đơn vị phút)
        typeMap[item.sleepType].totalMinutes += item.sleepLen / 60;
    }

    return result;
}

function getFinalSleepData(sleepData: SleepData): FinalSleepData {
    const newData = sleepData.data.map((item) => {
        const { deepSleepCount, lightSleepCount, deepSleepTotal, lightSleepTotal, rapidEyeMovementTotal, wakeCount, wakeDuration, ...rest } = item;
        return {
            ...rest,
            sleepData: groupSleepData(item.sleepData)
        };
    });

    const overview: SleepOverview = {
        wakeupCount: sleepData.data.length,
        startDate: sleepData.data[0]?.startTime,
        endDate: sleepData.data[sleepData.data.length - 1]?.endTime,
        totalDeepSleep: Number(newData.reduce((total: number, item) => {
            const deepSleep = item.sleepData.find(stage => stage.sleepType === "deepSleep");
            return total + (deepSleep?.totalMinutes || 0);
        }, 0).toFixed(2)),
        totalLightSleep: Number(newData.reduce((total: number, item) => {
            const lightSleep = item.sleepData.find(stage => stage.sleepType === "lightSleep");
            return total + (lightSleep?.totalMinutes || 0);
        }, 0).toFixed(2)),
        totalREM: Number(newData.reduce((total: number, item) => {
            const rem = item.sleepData.find(stage => stage.sleepType === "rem");
            return total + (rem?.totalMinutes || 0);
        }, 0).toFixed(2)),
        totalSleepTime: Number(newData.reduce((total: number, item) => {
            return total + item.sleepData.reduce((sum: number, stage) => sum + stage.totalMinutes, 0);
        }, 0).toFixed(2))
    };

    return {
        overview,
        sleepData: newData
    }
}

export { getFinalSleepData };

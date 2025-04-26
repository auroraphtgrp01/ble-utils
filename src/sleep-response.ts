interface SleepStage {
    sleepType: number;
    sleepStartTime: number;
    sleepLen: number;
}

interface SleepSession {
    startTime: number;
    endTime: number;
    deepSleepCount: number;
    lightSleepCount: number;
    deepSleepTotal: number;
    lightSleepTotal: number;
    rapidEyeMovementTotal: number;
    wakeCount: number;
    wakeDuration: number;
    sleepData: SleepStage[];
}

interface SleepResponse {
    code: number;
    dataType: number;
    data: SleepSession[];
}

function convertToSleepResponse(unpackResult: Record<string, any>): SleepResponse {
    if (!unpackResult || unpackResult.dataType !== 1284) {
        throw new Error('Invalid input: Expected sleep history data (dataType 1284)');
    }

    const sleepSessions: SleepSession[] = (unpackResult.data || []).map((session: any) => ({
        startTime: session.startTime,
        endTime: session.endTime,
        deepSleepCount: session.deepSleepCount,
        lightSleepCount: session.lightSleepCount,
        deepSleepTotal: session.deepSleepTotal,
        lightSleepTotal: session.lightSleepTotal,
        rapidEyeMovementTotal: session.rapidEyeMovementTotal,
        wakeCount: session.wakeCount,
        wakeDuration: session.wakeDuration,
        sleepData: (session.sleepData || []).map((stage: any) => ({
            sleepType: stage.sleepType,
            sleepStartTime: stage.sleepStartTime,
            sleepLen: stage.sleepLen
        }))
    }));

    return {
        code: unpackResult.code || 0,
        dataType: unpackResult.dataType,
        data: sleepSessions
    };
}

export default convertToSleepResponse
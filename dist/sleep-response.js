"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToSleepResponse(unpackResult) {
    if (!unpackResult || unpackResult.dataType !== 1284) {
        throw new Error('Invalid input: Expected sleep history data (dataType 1284)');
    }
    const sleepSessions = (unpackResult.data || []).map((session) => ({
        startTime: session.startTime,
        endTime: session.endTime,
        deepSleepCount: session.deepSleepCount,
        lightSleepCount: session.lightSleepCount,
        deepSleepTotal: session.deepSleepTotal,
        lightSleepTotal: session.lightSleepTotal,
        rapidEyeMovementTotal: session.rapidEyeMovementTotal,
        wakeCount: session.wakeCount,
        wakeDuration: session.wakeDuration,
        sleepData: (session.sleepData || []).map((stage) => ({
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
exports.default = convertToSleepResponse;

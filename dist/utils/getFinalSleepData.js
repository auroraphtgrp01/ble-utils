"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinalSleepData = getFinalSleepData;
function groupSleepData(sleepData) {
    const result = [];
    const typeMap = {};
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
function getFinalSleepData(sleepData) {
    var _a, _b;
    const newData = sleepData.data.map((item) => {
        const { deepSleepCount, lightSleepCount, deepSleepTotal, lightSleepTotal, rapidEyeMovementTotal, wakeCount, wakeDuration } = item, rest = __rest(item, ["deepSleepCount", "lightSleepCount", "deepSleepTotal", "lightSleepTotal", "rapidEyeMovementTotal", "wakeCount", "wakeDuration"]);
        return Object.assign(Object.assign({}, rest), { sleepData: groupSleepData(item.sleepData) });
    });
    const overview = {
        wakeupCount: sleepData.data.length,
        startDate: (_a = sleepData.data[0]) === null || _a === void 0 ? void 0 : _a.startTime,
        endDate: (_b = sleepData.data[sleepData.data.length - 1]) === null || _b === void 0 ? void 0 : _b.endTime,
        totalDeepSleep: Number(newData.reduce((total, item) => {
            const deepSleep = item.sleepData.find(stage => stage.sleepType === "deepSleep");
            return total + ((deepSleep === null || deepSleep === void 0 ? void 0 : deepSleep.totalMinutes) || 0);
        }, 0).toFixed(2)),
        totalLightSleep: Number(newData.reduce((total, item) => {
            const lightSleep = item.sleepData.find(stage => stage.sleepType === "lightSleep");
            return total + ((lightSleep === null || lightSleep === void 0 ? void 0 : lightSleep.totalMinutes) || 0);
        }, 0).toFixed(2)),
        totalREM: Number(newData.reduce((total, item) => {
            const rem = item.sleepData.find(stage => stage.sleepType === "rem");
            return total + ((rem === null || rem === void 0 ? void 0 : rem.totalMinutes) || 0);
        }, 0).toFixed(2)),
        totalSleepTime: Number(newData.reduce((total, item) => {
            return total + item.sleepData.reduce((sum, stage) => sum + stage.totalMinutes, 0);
        }, 0).toFixed(2))
    };
    return {
        overview,
        sleepData: newData
    };
}

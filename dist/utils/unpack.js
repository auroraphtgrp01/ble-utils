"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackHealthData = unpackHealthData;
const getSleetType_1 = require("./getSleetType");
const timestamps_1 = __importDefault(require("./timestamps"));
function unpackHealthData(bArr, i2) {
    const offset = -new Date().getTimezoneOffset() * 60 * 1000; // Convert minutes to milliseconds, negate to match Java's offset
    const result = { code: 0 };
    const dv = new DataView(bArr.buffer, bArr.byteOffset, bArr.length);
    switch (i2) {
        case 2: // Sport History
            const sportData = [];
            let index2 = 0;
            while (index2 + 14 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index2, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index2 += 4;
                const endTimeSeconds = dv.getUint32(index2, true);
                const endTime = (endTimeSeconds + 946684800) * 1000 - offset;
                index2 += 4;
                const step = dv.getUint16(index2, true);
                index2 += 2;
                const distance = dv.getUint16(index2, true);
                index2 += 2;
                const calorie = dv.getUint16(index2, true);
                index2 += 2;
                sportData.push({
                    sportStartTime: startTime,
                    sportEndTime: endTime,
                    sportStep: step,
                    sportCalorie: calorie,
                    sportDistance: distance
                });
            }
            result.dataType = 1282; // Health_HistorySport
            result.data = sportData;
            break;
        case 4: // Sleep History
            const sleepData = [];
            let index4 = 0;
            while (index4 + 20 <= bArr.length) {
                const startIndex = index4;
                index4 += 2; // Skip 2 bytes (b2, b3)
                const totalLength = dv.getUint16(index4, true);
                index4 += 2;
                const startTimeSeconds = dv.getUint32(index4, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index4 += 4;
                const endTimeSeconds = dv.getUint32(index4, true);
                const endTime = (endTimeSeconds + 946684800) * 1000 - offset;
                index4 += 4;
                const deepSleepCount = dv.getUint16(index4, true);
                index4 += 2;
                let lightSleepCount = 0;
                let rapidEyeMovementTotal = 0;
                let deepSleepTotal;
                let lightSleepTotal;
                if (deepSleepCount === 65535) {
                    rapidEyeMovementTotal = dv.getUint16(index4, true);
                    index4 += 2;
                    deepSleepTotal = dv.getUint16(index4, true);
                    index4 += 2;
                    lightSleepTotal = dv.getUint16(index4, true);
                    index4 += 2;
                }
                else {
                    lightSleepCount = dv.getUint16(index4, true);
                    index4 += 2;
                    deepSleepTotal = dv.getUint16(index4, true) * 60;
                    index4 += 2;
                    lightSleepTotal = dv.getUint16(index4, true) * 60;
                    index4 += 2;
                }
                const stages = [];
                const timestamps = new Set();
                while (index4 - startIndex + 8 <= totalLength) {
                    const type = bArr[index4];
                    index4 += 1;
                    const stageTimeSeconds = dv.getUint32(index4, true);
                    const stageTime = (stageTimeSeconds + 946684800) * 1000 - offset;
                    index4 += 4;
                    const duration = (bArr[index4] & 0xFF) + ((bArr[index4 + 1] & 0xFF) << 8) + ((bArr[index4 + 2] & 0xFF) << 16);
                    index4 += 3;
                    const stageTimeStr = `${stageTime}`;
                    if (!timestamps.has(stageTimeStr)) {
                        stages.push({
                            sleepType: type,
                            type: (0, getSleetType_1.getSleetType)(type),
                            sleepStartTime: (0, timestamps_1.default)(stageTime),
                            sleepLen: duration
                        });
                        timestamps.add(stageTimeStr);
                    }
                }
                let wakeCount = 0;
                let wakeDuration = 0;
                for (const stage of stages) {
                    if (stage.sleepType === 244) { // awake
                        wakeCount++;
                        wakeDuration += stage.sleepLen;
                    }
                }
                sleepData.push({
                    startTime: (0, timestamps_1.default)(startTime),
                    endTime: (0, timestamps_1.default)(endTime),
                    deepSleepCount,
                    lightSleepCount,
                    deepSleepTotal,
                    lightSleepTotal,
                    rapidEyeMovementTotal,
                    sleepData: stages,
                    wakeCount,
                    wakeDuration
                });
            }
            result.dataType = 1284; // Health_HistorySleep
            result.data = sleepData;
            break;
        case 6: // Heart History
            const heartData = [];
            let index6 = 0;
            while (index6 + 6 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index6, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index6 += 4;
                const heartValue = bArr[index6];
                index6 += 2; // 1 byte value + 1 padding
                heartData.push({
                    heartStartTime: startTime,
                    heartValue: heartValue & 0xFF
                });
            }
            result.dataType = 1286; // Health_HistoryHeart
            result.data = heartData;
            break;
        case 8: // Blood Pressure History
            const bloodData = [];
            let index8 = 0;
            while (index8 + 8 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index8, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index8 += 4;
                const isInflated = bArr[index8];
                index8 += 1;
                const sbp = bArr[index8];
                index8 += 1;
                const dbp = bArr[index8];
                index8 += 2; // 1 byte value + 1 padding
                bloodData.push({
                    bloodStartTime: (0, timestamps_1.default)(startTime),
                    bloodSBP: sbp & 0xFF,
                    bloodDBP: dbp & 0xFF,
                    isInflated: isInflated & 0xFF
                });
            }
            result.dataType = 1288; // Health_HistoryBlood
            result.data = bloodData;
            break;
        case 9: // Comprehensive Measurement
            const compData = [];
            let index9 = 0;
            while (index9 + 20 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index9, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index9 += 4;
                const stepValue = dv.getUint16(index9, true);
                index9 += 2;
                const heartValue = bArr[index9] & 0xFF;
                index9 += 1;
                const sbp = bArr[index9] & 0xFF;
                index9 += 1;
                const dbp = bArr[index9] & 0xFF;
                index9 += 1;
                const ooValue = bArr[index9] & 0xFF;
                index9 += 1;
                const respiratoryRateValue = bArr[index9] & 0xFF;
                index9 += 1;
                const hrvValue = bArr[index9] & 0xFF;
                index9 += 1;
                const cvrrValue = bArr[index9] & 0xFF;
                index9 += 1;
                const tempIntValue = bArr[index9] & 0xFF;
                index9 += 1;
                const tempFloatValue = bArr[index9] & 0xFF;
                index9 += 1;
                const bodyFatIntValue = bArr[index9] & 0xFF;
                index9 += 1;
                const bodyFatFloatValue = bArr[index9] & 0xFF;
                index9 += 1;
                const bloodSugarValue = bArr[index9] & 0xFF;
                index9 += 3; // Align to Java's i10 increment
                compData.push({
                    startTime,
                    stepValue,
                    heartValue,
                    DBPValue: dbp,
                    SBPValue: sbp,
                    OOValue: ooValue,
                    respiratoryRateValue,
                    hrvValue,
                    cvrrValue,
                    tempIntValue,
                    tempFloatValue,
                    bodyFatIntValue,
                    bodyFatFloatValue,
                    bloodSugarValue
                });
            }
            result.dataType = 1289; // Health_HistoryAll
            result.data = compData;
            break;
        case 26: // Blood Oxygen History
            const oxygenData = [];
            let index26 = 0;
            while (index26 + 6 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index26, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index26 += 4;
                const type = bArr[index26] & 0xFF;
                index26 += 1;
                const value = bArr[index26] & 0xFF;
                index26 += 1;
                oxygenData.push({
                    startTime,
                    type,
                    value
                });
            }
            result.dataType = 1306; // Health_HistoryBloodOxygen
            result.data = oxygenData;
            break;
        case 28: // Temp and Humidity History
            const tempHumidData = [];
            let index28 = 0;
            while (index28 + 9 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index28, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index28 += 4;
                const type = bArr[index28] & 0xFF;
                index28 += 1;
                const tempValue = parseFloat(`${bArr[index28] & 0xFF}.${bArr[index28 + 1] & 0xFF}`);
                index28 += 2;
                const humidValue = parseFloat(`${bArr[index28] & 0xFF}.${bArr[index28 + 1] & 0xFF}`);
                index28 += 2;
                tempHumidData.push({
                    startTime,
                    type,
                    tempValue,
                    humidValue
                });
            }
            result.dataType = 1308; // Health_HistoryTempAndHumidity
            result.data = tempHumidData;
            break;
        case 30: // Temperature History
            const tempData = [];
            let index30 = 0;
            while (index30 + 5 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index30, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index30 += 4;
                const type = bArr[index30] & 0xFF;
                index30 += 1;
                const tempValue = parseFloat(`${bArr[index30] & 0xFF}.${bArr[index30 + 1] & 0xFF}`);
                index30 += 2;
                tempData.push({
                    startTime,
                    type,
                    tempValue
                });
            }
            result.dataType = 1310; // Health_HistoryTemp
            result.data = tempData;
            break;
        case 32: // Ambient Light History
            const ambientData = [];
            let index32 = 0;
            while (index32 + 6 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index32, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index32 += 4;
                const type = bArr[index32] & 0xFF;
                index32 += 1;
                const value = dv.getUint16(index32, true);
                index32 += 2;
                ambientData.push({
                    startTime,
                    type,
                    value
                });
            }
            result.dataType = 1312; // Health_HistoryAmbientLight
            result.data = ambientData;
            break;
        case 41: // Fall History
            const fallData = [];
            let index41 = 0;
            while (index41 + 5 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index41, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index41 += 4;
                const state = bArr[index41] & 0xFF;
                index41 += 1;
                fallData.push({
                    startTime,
                    state
                });
            }
            result.dataType = 1321; // Health_HistoryFall
            result.data = fallData;
            break;
        case 43: // Health Monitoring History
            const healthMonData = [];
            let index43 = 0;
            while (index43 + 30 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index43, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index43 += 4;
                const stepValue = dv.getUint32(index43, true);
                index43 += 4;
                const heartValue = bArr[index43] & 0xFF;
                index43 += 1;
                const sbp = bArr[index43] & 0xFF;
                index43 += 1;
                const dbp = bArr[index43] & 0xFF;
                index43 += 1;
                const ooValue = bArr[index43] & 0xFF;
                index43 += 1;
                const respiratoryRateValue = bArr[index43] & 0xFF;
                index43 += 1;
                const hrvValue = bArr[index43] & 0xFF;
                index43 += 1;
                const cvrrValue = bArr[index43] & 0xFF;
                index43 += 1;
                const tempIntValue = bArr[index43] & 0xFF;
                index43 += 1;
                const tempFloatValue = bArr[index43] & 0xFF;
                index43 += 1;
                const humidIntValue = bArr[index43] & 0xFF;
                index43 += 1;
                const humidFloatValue = bArr[index43] & 0xFF;
                index43 += 1;
                const ambientLightValue = dv.getUint16(index43, true);
                index43 += 2;
                const isSportMode = bArr[index43] & 0xFF;
                index43 += 1;
                const calorie = dv.getUint16(index43, true);
                index43 += 2;
                const distance = bArr[index43] & 0xFF;
                index43 += 5; // Align to Java's i10 increment
                healthMonData.push({
                    startTime,
                    stepValue,
                    heartValue,
                    DBPValue: dbp,
                    SBPValue: sbp,
                    OOValue: ooValue,
                    respiratoryRateValue,
                    hrvValue,
                    cvrrValue,
                    tempIntValue,
                    tempFloatValue,
                    humidIntValue,
                    humidFloatValue,
                    ambientLightValue,
                    isSprotMode: isSportMode, // Typo retained from Java
                    sportCalorie: calorie,
                    sportDistance: distance
                });
            }
            result.dataType = 1323; // Health_HistoryHealthMonitoring
            result.data = healthMonData;
            break;
        case 45: // Sport Mode History
            const sportModeData = [];
            let index45 = 0;
            while (index45 + 26 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index45, true);
                const startTime = (startTimeSeconds + 946684800) * 1000 - offset;
                index45 += 4;
                const sportSteps = dv.getUint32(index45, true);
                index45 += 4;
                const endTimeSeconds = dv.getUint32(index45, true);
                const endTime = (endTimeSeconds + 946684800) * 1000 - offset;
                index45 += 4;
                const sportDistances = dv.getUint16(index45, true);
                index45 += 2;
                const sportCalories = dv.getUint16(index45, true);
                index45 += 2;
                const sportMode = bArr[index45] & 0xFF;
                index45 += 1;
                const startMethod = bArr[index45] & 0xFF;
                index45 += 1;
                const sportHeartRate = bArr[index45] & 0xFF;
                index45 += 1;
                const sportTime = dv.getUint32(index45, true);
                index45 += 4;
                const minHeartRate = bArr[index45] & 0xFF;
                index45 += 1;
                const maxHeartRate = bArr[index45] & 0xFF;
                index45 += 2; // Align to Java's i10 increment
                sportModeData.push({
                    startTime,
                    endTime,
                    sportSteps,
                    sportDistances,
                    sportCalories,
                    sportMode,
                    startMethod,
                    sportHeartRate,
                    sportTime,
                    minHeartRate,
                    maxHeartRate
                });
            }
            result.dataType = 1325; // Health_HistorySportMode
            result.data = sportModeData;
            break;
        case 47: // Comprehensive Measure Data History
            const compMeasureData = [];
            let index47 = 0;
            while (index47 + 44 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index47, true);
                const time = (startTimeSeconds + 946684800) * 1000 - offset;
                index47 += 4;
                const bloodSugarModel = bArr[index47] & 0xFF;
                index47 += 1;
                const bloodSugarInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const bloodSugarFloat = bArr[index47] & 0xFF;
                index47 += 1;
                const uricAcidModel = bArr[index47] & 0xFF;
                index47 += 1;
                const uricAcid = dv.getUint16(index47, true);
                index47 += 2;
                const bloodKetoneModel = bArr[index47] & 0xFF;
                index47 += 1;
                const bloodKetoneInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const bloodKetoneFloat = bArr[index47] & 0xFF;
                index47 += 1;
                const bloodFatModel = bArr[index47] & 0xFF;
                index47 += 1;
                const cholesterolInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const cholesterolFloat = bArr[index47] & 0xFF;
                index47 += 1;
                const highLipoproteinCholesterolInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const highLipoproteinCholesterolFloat = bArr[index47] & 0xFF;
                index47 += 1;
                const lowLipoproteinCholesterolInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const lowLipoproteinCholesterolFloat = bArr[index47] & 0xFF;
                index47 += 1;
                const triglycerideCholesterolInteger = bArr[index47] & 0xFF;
                index47 += 1;
                const triglycerideCholesterolFloat = bArr[index47] & 0xFF;
                index47 += 23; // Align to Java's i10 increment
                compMeasureData.push({
                    time,
                    bloodSugarModel,
                    bloodSugarInteger,
                    bloodSugarFloat,
                    uricAcidModel,
                    uricAcid,
                    bloodKetoneModel,
                    bloodKetoneInteger,
                    bloodKetoneFloat,
                    bloodFatModel,
                    cholesterolInteger,
                    cholesterolFloat,
                    highLipoproteinCholesterolInteger,
                    highLipoproteinCholesterolFloat,
                    lowLipoproteinCholesterolInteger,
                    lowLipoproteinCholesterolFloat,
                    triglycerideCholesterolInteger,
                    triglycerideCholesterolFloat
                });
            }
            result.dataType = 1327; // Health_HistoryComprehensiveMeasureData
            result.data = compMeasureData;
            break;
        case 49: // Background Reminder Record
            const bgReminderData = [];
            let index49 = 0;
            while (index49 + 44 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index49, true);
                const time = (startTimeSeconds + 946684800) * 1000 - offset;
                index49 += 4;
                const data = bArr[index49] & 0xFF;
                index49 += 7; // Align to Java's i10 increment
                bgReminderData.push({
                    time,
                    data
                });
            }
            result.dataType = 1329; // health_BackgroundReminderRecord
            result.data = bgReminderData;
            break;
        case 51: // Body Data History
            const bodyData = [];
            let index51 = 0;
            while (index51 + 28 <= bArr.length) {
                const startTimeSeconds = dv.getUint32(index51, true);
                const time = (startTimeSeconds + 946684800) * 1000 - offset;
                index51 += 4;
                const loadIndexInteger = bArr[index51] & 0xFF;
                index51 += 1;
                const loadIndexFloat = bArr[index51] & 0xFF;
                index51 += 1;
                const hrvInteger = bArr[index51] & 0xFF;
                index51 += 1;
                const hrvFloat = bArr[index51] & 0xFF;
                index51 += 1;
                const pressureInteger = bArr[index51] & 0xFF;
                index51 += 1;
                const pressureFloat = bArr[index51] & 0xFF;
                index51 += 1;
                const bodyInteger = bArr[index51] & 0xFF;
                index51 += 1;
                const bodyFloat = bArr[index51] & 0xFF;
                index51 += 1;
                const sympatheticInteger = bArr[index51] & 0xFF;
                index51 += 1;
                const sympatheticFloat = bArr[index51] & 0xFF;
                index51 += 1;
                const sdn = dv.getUint16(index51, true);
                index51 += 2;
                const maximalOxygenIntake = bArr[index51] & 0xFF;
                index51 += 12; // Align to Java's i10 increment
                bodyData.push({
                    time,
                    loadIndexInteger,
                    loadIndexFloat,
                    hrvInteger,
                    hrvFloat,
                    pressureInteger,
                    pressureFloat,
                    bodyInteger,
                    bodyFloat,
                    sympatheticInteger,
                    sympatheticFloat,
                    sdn,
                    maximalOxygenIntake
                });
            }
            result.dataType = 1331; // Health_History_Body_Data
            result.data = bodyData;
            break;
        default:
            break;
    }
    return result;
}

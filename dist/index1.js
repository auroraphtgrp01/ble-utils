"use strict";
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
                            sleepStartTime: stageTime,
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
                    startTime,
                    endTime,
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
                    bloodStartTime: startTime,
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
// const bArr = new Uint8Array(`af fa 54 00 7e f1 9e 2f c1 01 9f 2f ff ff 3e 01 c4 01 3d 0d f2 7e f1 9e 2f 4c 05 00 f1 cb f6 9e 2f 50 01 00 f3 1c f8 9e 2f fb 00 00 f2 18 f9 9e 2f 46 03 00 f3 5f fc 9e 2f 43 00 00 f2 a2 fc 9e 2f 94 04 00 f1 36 01 9f 2f 74 00 00 f2 aa 01 9f 2f 17 00 00 af fa 54 01 e5 01 9f 2f c8 57 9f 2f ff ff 0f 0e 9d 0d 24 3a f2 e5 01 9f 2f 0a 05 00 f1 f0 06 9f 2f bf 01 00 f3 b0 08 9f 2f df 00 00 f2 90 09 9f 2f b3 02 00 f3 44 0c 9f 2f 04 01 00 f2 48 0d 9f 2f 25 05 00 f1 6d 12 9f 2f 64 00 00 f3 d1 12 9f 2f 1d 01 00 f2 ee 13 9f 2f 7b 06 00 f1 69 1a 9f 2f 63 00 00 f2 cc 1a 9f 2f d4 00 00 f3 a0 1b 9f 2f 5b 00 00 f2 fb 1b 9f 2f e5 04 00 f1 e1 20 9f 2f 72 01 00 f3 54 22 9f 2f b8 01 00 f2 0d 24 9f 2f 8b 00 00 f3 99 24 9f 2f 3d 00 00 f2 d6 24 9f 2f 82 04 00 f1 59 29 9f 2f 47 01 00 f3 a1 2a 9f 2f de 00 00 f2 80 2b 9f 2f f6 02 00 f3 77 2e 9f 2f de 00 00 f2 55 2f 9f 2f 4f 05 00 f1 a5 34 9f 2f c0 01 00 f3 66 36 9f 2f cc 01 00 f2 33 38 9f 2f e0 01 00 f3 14 3a 9f 2f 57 00 00 f2 6b 3a 9f 2f af 02 00 f3 1a 3d 9f 2f 16 02 00 f2 30 3f 9f 2f 75 00 00 f3 a5 3f 9f 2f c5 00 00 f2 6a 40 9f 2f 04 00 00 f3 6e 40 9f 2f 60 00 00 f2 ce 40 9f 2f 46 05 00 f1 15 46 9f 2f cc 00 00 f3 e2 46 9f 2f 68 01 00 f1 4b 48 9f 2f d2 05 00 f2 1d 4e 9f 2f fe 05 00 f3 1b 54 9f 2f 3d 00 00 f2 58 54 9f 2f 70 03 00`); 

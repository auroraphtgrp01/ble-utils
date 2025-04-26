import { SleepData } from "./types/sleep";
import { unpackHealthData } from "./utils/unpack";
import { getFinalSleepData } from "./utils/getFinalSleepData";
import { unpackSleepData } from "./handler/sleep";
import { unpackBloodPressureData } from "./handler/bloodPressure";
import { unpackSportHistoryData } from "./handler/sport";
import { unpackComprehensiveMeasurementHistoryData } from "./handler/comprehensiveMeasurement";
import { mockBloodPressureHex, mockComprehensiveMeasurementHex, mockSleepingDataHex, mockSportHex } from "./data/data";




console.log(JSON.stringify(unpackSleepData(mockSleepingDataHex), null, 2)) // 4

// console.log(JSON.stringify(unpackSportHistoryData(mockSportHex), null, 2)) // 2

// console.log(JSON.stringify(unpackBloodPressureData(mockBloodPressureHex), null, 2)) // 8

// console.log(JSON.stringify(unpackComprehensiveMeasurementHistoryData(mockComprehensiveMeasurementHex), null, 2)) // 9




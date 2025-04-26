"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.DATATYPE = {
    Health_HistorySport: 2,
    Health_HistorySleep: 4,
    Health_HistoryHeart: 6,
    Health_HistoryBlood: 8,
    Health_HistoryHealthMonitoring: 1273,
    Health_HistoryBloodOxygen: 26,
    Health_HistoryTempAndHumidity: 28,
    Health_HistoryTemp: 30,
    Health_HistoryAmbientLight: 32,
    Health_HistoryFall: 41,
    Health_HistorySportMode: 45,
    Health_HistoryComprehensiveMeasureData: 47,
    Health_History_Body_Data: 51
};
Constants.DATA_SLEEP_TYPE = {
    awake: 244,
    deepSleep: 241,
    lightSleep: 242,
    naps: 245,
    rem: 243,
    unknow: -1,
};
Constants.DATA_UNPACK_TYPE = {
    sportHistory: 2,
    sleepHistory: 4,
    heartHistory: 6,
    bloodPressureHistory: 8,
    comprehensiveMeasurement: 9
};

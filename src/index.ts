import { unpackSleepData } from "./handler/sleep";
import { mockDeviceInfoHex, mockHeartHex, mockSleepingDataHex } from "./data/data";
import { unpackHeartHistoryData } from "./handler/heart";
import { unpackDeviceInfoData } from "./utils/unpack";
import { unpackDeviceInfo } from "./handler/deviceInfoHandler";



// console.log(JSON.stringify(unpackSportHistoryData(mockSportHex), null, 2)) // 2

// console.log(JSON.stringify(unpackSleepData(mockSleepingDataHex), null, 2)) // 4

// console.log(JSON.stringify(unpackHeartHistoryData(mockHeartHex), null, 2)) // 4

// console.log(JSON.stringify(unpackBloodPressureData(mockBloodPressureHex), null, 2)) // 8

// console.log(JSON.stringify(unpackComprehensiveMeasurementHistoryData(mockComprehensiveMeasurementHex), null, 2)) // 9



  // Ví dụ sử dụng với input đầu vào
  // const rawData = new Uint8Array([
  //   0x02, 0x00, 0x1e, 0x00, 0xa3, 0x00, 0x12, 0x02, 
  //   0x00, 0x30, 0x00, 0x01, 0x00, 0x03, 0x1e, 0xca, 
  //   0x75, 0x90, 0xc3, 0x4f, 0xb8, 0xb5, 0x01, 0xc8, 
  //   0x84, 0xec, 0xa9, 0x91, 0x7c, 0xbf
  // ]);
  // const unpacked = unpackDeviceInfoData(rawData);
  // console.log("deviceId:", unpacked.data.deviceId);             // 163
  // console.log("deviceVersion:", unpacked.data.deviceVersion);   // "2.18"
  // console.log("deviceBatteryState:", unpacked.data.deviceBatteryState); // 0
  // console.log("deviceBatteryValue:", unpacked.data.deviceBatteryValue); // 48

console.log(JSON.stringify(unpackDeviceInfo(mockDeviceInfoHex), null, 2))
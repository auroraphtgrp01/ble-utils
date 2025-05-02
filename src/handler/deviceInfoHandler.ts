import { Constants } from "../constants";
import hexStringToUint8Array from "../utils/hexStringToUint8Array";
import { unpackDeviceInfoData, unpackHealthData } from "../utils/unpack";

export const unpackDeviceInfo = (
    byteArr: any
) => {
    const rawData = unpackDeviceInfoData(hexStringToUint8Array(byteArr));
    return {
        deviceId: rawData.data.deviceId,
        deviceVersion: rawData.data.deviceVersion,
        deviceBatteryState: rawData.data.deviceBatteryState,
        deviceBatteryValue: rawData.data.deviceBatteryValue,
    };
}
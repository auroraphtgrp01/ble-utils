"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSleepHistory = decodeSleepHistory;
/**
 * Chuyển đổi chuỗi hex thành mảng byte
 * @param hexString Chuỗi hex cần chuyển đổi
 * @returns Mảng byte
 */
function hexStringToBytes(hexString) {
    const hex = hexString.replace(/\s+/g, '').match(/.{1,2}/g) || [];
    return hex.map(byte => parseInt(byte, 16));
}
/**
 * Định dạng thời gian từ timestamp thành chuỗi "hh:mm dd/mm/yyyy" ở múi giờ UTC+7
 * @param timestamp Timestamp cần định dạng (đơn vị: millisecond)
 * @returns Chuỗi thời gian đã định dạng
 */
function formatTimestamp(timestamp) {
    // Bù múi giờ UTC+7 (7 giờ = 7 * 3600 * 1000 ms)
    const vietnamOffset = 7 * 3600 * 1000;
    const date = new Date(timestamp + vietnamOffset);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}
/**
 * Giải mã dữ liệu hex về giấc ngủ
 * @param data Mảng byte chứa dữ liệu
 * @returns Đối tượng chứa kết quả giải mã
 */
function decodeSleepData(data) {
    const SECONDS_FROM_2000 = 946684800; // Unix timestamp cho 2000-01-01 00:00:00 UTC
    const TIMESTAMP_OFFSET = 720000; // 12 phút để điều chỉnh timestamp
    const result = { code: 0, data: [] };
    let offset = 0;
    while (offset + 20 <= data.length) {
        // Kiểm tra marker của bản ghi (af fa 54 xx)
        if (data[offset] !== 0xaf || data[offset + 1] !== 0xfa || data[offset + 2] !== 0x54) {
            offset++;
            continue;
        }
        offset += 4; // Bỏ qua marker (af fa 54) và sub-ID
        // Đọc thời gian bắt đầu (4 bytes, little-endian)
        const startTimeRaw = data[offset] +
            (data[offset + 1] << 8) +
            (data[offset + 2] << 16) +
            (data[offset + 3] << 24);
        const startTime = (startTimeRaw + SECONDS_FROM_2000) * 1000 - TIMESTAMP_OFFSET;
        offset += 4;
        // Đọc thời gian kết thúc (4 bytes)
        const endTimeRaw = data[offset] +
            (data[offset + 1] << 8) +
            (data[offset + 2] << 16) +
            (data[offset + 3] << 24);
        const endTime = (endTimeRaw + SECONDS_FROM_2000) * 1000 - TIMESTAMP_OFFSET;
        offset += 4;
        // Đọc deepSleepCount (2 bytes)
        const deepSleepCount = data[offset] + (data[offset + 1] << 8);
        offset += 2;
        // Đọc rapidEyeMovementTotal (2 bytes)
        const rapidEyeMovementTotal = (data[offset] + (data[offset + 1] << 8)) * 60; // Chuyển phút sang giây
        offset += 2;
        // Đọc lightSleepTotal (2 bytes)
        const lightSleepTotal = (data[offset] + (data[offset + 1] << 8)) * 60; // Chuyển phút sang giây
        offset += 2;
        // Bỏ qua 2 byte không rõ mục đích
        offset += 2;
        // Đọc các giai đoạn giấc ngủ
        const sleepData = [];
        let deepSleepTotal = 0;
        let lightSleepCount = 0;
        let wakeCount = 0;
        let wakeDuration = 0;
        while (offset + 8 <= data.length) {
            if (data[offset] === 0xaf && data[offset + 1] === 0xfa) {
                break; // Gặp marker của bản ghi tiếp theo
            }
            const sleepType = data[offset++];
            // Đọc thời gian bắt đầu của giai đoạn (4 bytes)
            const phaseStartTimeRaw = data[offset] +
                (data[offset + 1] << 8) +
                (data[offset + 2] << 16) +
                (data[offset + 3] << 24);
            const phaseStartTime = (phaseStartTimeRaw + SECONDS_FROM_2000) * 1000 - TIMESTAMP_OFFSET;
            offset += 4;
            // Đọc độ dài giai đoạn (3 bytes)
            const phaseLen = data[offset] + (data[offset + 1] << 8) + (data[offset + 2] << 16);
            offset += 3;
            const sleepPhase = {
                sleepType,
                sleepStartTime: phaseStartTime,
                sleepLen: phaseLen,
                formattedTime: formatTimestamp(phaseStartTime),
            };
            sleepData.push(sleepPhase);
            // Tính toán các giá trị tổng
            if (sleepType === 0xf3) { // Deep sleep
                deepSleepTotal += phaseLen * 60; // Chuyển phút sang giây
            }
            else if (sleepType === 0xf2) { // Light sleep
                lightSleepCount++;
            }
            else if (sleepType === 0xf4) { // Wake
                wakeCount++;
                wakeDuration += phaseLen * 60; // Chuyển phút sang giây
            }
        }
        // Tạo bản ghi giấc ngủ
        const sleepRecord = {
            startTime,
            endTime,
            deepSleepCount,
            lightSleepCount,
            deepSleepTotal,
            lightSleepTotal,
            rapidEyeMovementTotal,
            sleepData,
            wakeCount,
            wakeDuration,
            formattedStartTime: formatTimestamp(startTime),
            formattedEndTime: formatTimestamp(endTime),
        };
        result.data.push(sleepRecord);
    }
    return result;
}
/**
 * Định dạng lại đầu ra hex
 * @param input Mảng byte
 * @returns Chuỗi hex đã định dạng
 */
function formatHexOutput(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        result += input[i].toString(16).padStart(2, '0') + ' ';
        if ((i + 1) % 20 === 0)
            result += '\n';
    }
    return result.trim();
}
/**
 * Hàm chính để xử lý và định dạng dữ liệu từ chuỗi hex
 * @param hexInput Chuỗi hex đầu vào
 * @returns Chuỗi hex đã định dạng
 */
function decodeSleepHistory(hexInput) {
    const bytes = hexStringToBytes(hexInput);
    const decoded = decodeSleepData(bytes);
    console.log(JSON.stringify(decoded, null, 2));
    return formatHexOutput(bytes);
}
/**
 * Kiểm tra với dữ liệu hex
 */
const hexInput = `af fa 54 00 7e f1 9e 2f c1 01 9f 2f ff ff 3e 01 c4 01 3d 0d
                f2 7e f1 9e 2f 4c 05 00 f1 cb f6 9e 2f 50 01 00 f3 1c f8 9e
                2f fb 00 00 f2 18 f9 9e 2f 46 03 00 f3 5f fc 9e 2f 43 00 00
                f2 a2 fc 9e 2f 94 04 00 f1 36 01 9f 2f 74 00 00 f2 aa 01 9f
                2f 17 00 00 af fa 54 01 e5 01 9f 2f c8 57 9f 2f ff ff 0f 0e
                9d 0d 24 3a f2 e5 01 9f 2f 0a 05 00 f1 f0 06 9f 2f bf 01 00
                f3 b0 08 9f 2f df 00 00 f2 90 09 9f 2f b3 02 00 f3 44 0c 9f
                2f 04 01 00 f2 48 0d 9f 2f 25 05 00 f1 6d 12 9f 2f 64 00 00
                f3 d1 12 9f 2f 1d 01 00 f2 ee 13 9f 2f 7b 06 00 f1 69 1a 9f
                2f 63 00 00 f2 cc 1a 9f 2f d4 00 00 f3 a0 1b 9f 2f 5b 00 00
                f2 fb 1b 9f 2f e5 04 00 f1 e1 20 9f 2f 72 01 00 f3 54 22 9f
                2f b8 01 00 f2 0d 24 9f 2f 8b 00 00 f3 99 24 9f 2f 3d 00 00
                f2 d6 24 9f 2f 82 04 00 f1 59 29 9f 2f 47 01 00 f3 a1 2a 9f
                2f de 00 00 f2 80 2b 9f 2f f6 02 00 f3 77 2e 9f 2f de 00 00
                f2 55 2f 9f 2f 4f 05 00 f1 a5 34 9f 2f c0 01 00 f3 66 36 9f
                2f cc 01 00 f2 33 38 9f 2f e0 01 00 f3 14 3a 9f 2f 57 00 00
                f2 6b 3a 9f 2f af 02 00 f3 1a 3d 9f 2f 16 02 00 f2 30 3f 9f
                2f 75 00 00 f3 a5 3f 9f 2f c5 00 00 f2 6a 40 9f 2f 04 00 00
                f3 6e 40 9f 2f 60 00 00 f2 ce 40 9f 2f 46 05 00 f1 15 46 9f
                2f cc 00 00 f3 e2 46 9f 2f 68 01 00 f1 4b 48 9f 2f d2 05 00
                f2 1d 4e 9f 2f fe 05 00 f3 1b 54 9f 2f 3d 00 00 f2 58 54 9f
                2f 70 03 00`;
const result = decodeSleepHistory(hexInput);
console.log(result);

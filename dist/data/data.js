"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockComprehensiveMeasurementHex = exports.mockHeartHex = exports.heartDataType = exports.dataType2 = exports.dataType8 = exports.dataTypeForSleep = exports.sportType2Hex = exports.healthType8Hex = exports.sleepingDataHex = void 0;
exports.hexStringToUint8Array = hexStringToUint8Array;
function hexStringToUint8Array(hex) {
    const cleanHex = hex.replace(/\s/g, '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}
// ================================
const dataTypeForSleep = 4;
exports.dataTypeForSleep = dataTypeForSleep;
const sleepingDataHex = `af fa 54 00 7e f1 9e 2f c1 01 9f 2f ff ff 3e 01 c4 01 3d 0d
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
exports.sleepingDataHex = sleepingDataHex;
// =================================
const dataType8 = 8;
exports.dataType8 = dataType8;
const healthType8Hex = `96 de 9e 2f 01 6e 48 48 9e ec 9e 2f 01 73 4b 58 ba fa 9e 2f
                        01 6a 47 43 ca 08 9f 2f 01 6a 45 40 e4 16 9f 2f 01 6c 45 3e
                        fa 24 9f 2f 01 71 4b 53 f8 32 9f 2f 01 65 44 35 1a 41 9f 2f
                        01 68 45 3d 22 4f 9f 2f 01 69 46 3e`;
exports.healthType8Hex = healthType8Hex;
// =================================
const dataType2 = 2;
exports.dataType2 = dataType2;
const sportType2Hex = `80 de 9e 2f 88 e5 9e 2f 7d 00 4f 00 05 00`;
exports.sportType2Hex = sportType2Hex;
// =================================
const heartDataType = 6;
exports.heartDataType = heartDataType;
const mockHeartHex = `96 de 9e 2f 00 48 9e ec 9e 2f 00 58 ba fa 9e 2f 00 43 ca 08
                        9f 2f 00 40 e4 16 9f 2f 00 3e fa 24 9f 2f 00 53 f8 32 9f 2f
                        00 35 1a 41 9f 2f 00 3d 22 4f 9f 2f 00 3e`;
exports.mockHeartHex = mockHeartHex;
// =================================
const mockComprehensiveMeasurementHex = `96 de 9e 2f 00 00 48 6e 48 62 0e 2d 02 00 0f 00 00 00 10 23
                        9e ec 9e 2f 7d 00 58 73 4b 62 12 25 06 00 0f 00 00 00 bd 8d
                        ba fa 9e 2f 7d 00 43 6a 47 62 0d 2e 04 00 0f 00 00 00 72 31
                        ca 08 9f 2f 7d 00 40 6a 45 61 0d 28 02 00 0f 00 00 00 b7 34
                        e4 16 9f 2f 7d 00 3e 6c 45 60 0c 25 04 00 0f 00 00 00 77 65
                        fa 24 9f 2f 7d 00 53 71 4b 62 11 28 05 00 0f 00 00 00 79 86
                        f8 32 9f 2f 7d 00 35 65 44 5c 0b 2d 04 00 0f 00 00 00 d8 f7
                        1a 41 9f 2f 7d 00 3d 68 45 60 0c 25 02 00 0f 00 00 00 ce 42
                        22 4f 9f 2f 7d 00 3e 69 46 60 0c 27 02 00 0f 00 00 00 27 5d`;
exports.mockComprehensiveMeasurementHex = mockComprehensiveMeasurementHex;

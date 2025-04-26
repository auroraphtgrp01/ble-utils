"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hexStringToUint8Array(hex) {
    const cleanHex = hex.replace(/\s/g, '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}
exports.default = hexStringToUint8Array;

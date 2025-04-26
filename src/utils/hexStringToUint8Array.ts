function hexStringToUint8Array(hex: string): Uint8Array {
    const cleanHex = hex.replace(/\s/g, '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

export default hexStringToUint8Array
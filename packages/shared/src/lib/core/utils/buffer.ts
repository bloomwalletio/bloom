export function removeLeadingZeros(buffer: Buffer): Buffer {
    let indexToSliceFrom = 0
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === 0) {
            indexToSliceFrom = i + 1
        } else {
            break
        }
    }
    return buffer.subarray(indexToSliceFrom)
}

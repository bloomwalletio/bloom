export function removeLeadingZeros(array: Uint8Array): Uint8Array {
    let indexToSliceFrom = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i] === 0) {
            indexToSliceFrom = i + 1
        } else {
            break
        }
    }
    return array.subarray(indexToSliceFrom)
}

import { removeLeadingZeros } from '../array'

describe('array', () => {
    test('Removes leading zeros', () => {
        const array = Uint8Array.from([0, 0, 1])
        expect(removeLeadingZeros(array)).toEqual(Uint8Array.from([1]))
    })

    test('Uint8Array contains non-zero elements only', () => {
        const array1 = Uint8Array.from([1, 2, 3])
        expect(removeLeadingZeros(array1)).toEqual(array1)

        const array2 = Uint8Array.from([1])
        expect(removeLeadingZeros(array2)).toEqual(array2)

        const array3 = Uint8Array.from([1, 0, 0])
        expect(removeLeadingZeros(array3)).toEqual(array3)
    })

    test('Keeps non-leading zeros untouched', () => {
        const array = Uint8Array.from([1, 0, 0, 1])
        expect(removeLeadingZeros(array)).toEqual(array)
    })
})

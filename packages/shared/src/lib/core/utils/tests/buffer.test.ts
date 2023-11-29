import { removeLeadingZeros } from '../buffer'

describe('buffer', () => {
    test('Removes leading zeros', () => {
        const buffer = Buffer.from([0, 0, 1])
        expect(removeLeadingZeros(buffer)).toEqual(Buffer.from([1]))
    })

    test('Buffer contains non-zero elements only', () => {
        const buffer1 = Buffer.from([1, 2, 3])
        expect(removeLeadingZeros(buffer1)).toEqual(buffer1)

        const buffer2 = Buffer.from([1])
        expect(removeLeadingZeros(buffer2)).toEqual(buffer2)

        const buffer3 = Buffer.from([1, 0, 0])
        expect(removeLeadingZeros(buffer3)).toEqual(buffer3)
    })

    test('Keeps non-leading zeros untouched', () => {
        const buffer = Buffer.from([1, 0, 0, 1])
        expect(removeLeadingZeros(buffer)).toEqual(buffer)
    })
})

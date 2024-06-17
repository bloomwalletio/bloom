import {
    convertDateToUnixTimestamp,
    convertUInt16NumberToLittleEndianHex,
    convertUnixTimestampToDate,
    Converter,
} from '../convert'

describe('File: convert.ts', () => {
    const TEST_DATE = new Date('2023-04-20T00:00:00.000Z')
    const TEST_UNIX_TIMESTAMP = 1681948800
    describe('Function: convertDateToUnixTimestamp', () => {
        it('should handle valid date parameters', () => {
            expect(convertDateToUnixTimestamp(TEST_DATE)).toEqual(TEST_UNIX_TIMESTAMP)
        })
        it('should handle invalid date parameters', () => {
            expect(convertDateToUnixTimestamp('' as Date)).toEqual(undefined)
            expect(convertDateToUnixTimestamp(undefined)).toEqual(undefined)
        })
    })

    describe('Function: convertUnixTimestampToDate', () => {
        it('should handle valid timestamp parameters', () => {
            expect(convertUnixTimestampToDate(0)).toEqual(new Date('1970-01-01T00:00:00.000Z'))
            expect(convertUnixTimestampToDate(-1)).toEqual(new Date('1969-12-31T23:59:59.000Z'))
            expect(convertUnixTimestampToDate(TEST_UNIX_TIMESTAMP)).toEqual(TEST_DATE)
        })
        it('should handle invalid timestamp parameters', () => {
            expect(convertUnixTimestampToDate(undefined)).toEqual(undefined)
        })
    })

    describe('Function: convertUInt16NumberToLittleEndianHex', () => {
        it('should handle valid input', () => {
            expect(convertUInt16NumberToLittleEndianHex(0)).toEqual('0x0000')
            expect(convertUInt16NumberToLittleEndianHex(1)).toEqual('0x0100')
            expect(convertUInt16NumberToLittleEndianHex(-1)).toEqual('0xFFFF')
            expect(convertUInt16NumberToLittleEndianHex(255)).toEqual('0xFF00')
            expect(convertUInt16NumberToLittleEndianHex(511)).toEqual('0xFF01')
            expect(convertUInt16NumberToLittleEndianHex(1023)).toEqual('0xFF03')
            expect(convertUInt16NumberToLittleEndianHex(32767)).toEqual('0xFF7F')
            expect(convertUInt16NumberToLittleEndianHex(-32768)).toEqual('0x0080')
        })
        it('should handle invalid input', () => {
            expect(convertUInt16NumberToLittleEndianHex(undefined)).toEqual('0x0000')
        })
        it('should NOT use the hex prefix if specified', () => {
            expect(convertUInt16NumberToLittleEndianHex(0, false)).toEqual('0000')
            expect(convertUInt16NumberToLittleEndianHex(1, false)).toEqual('0100')
            expect(convertUInt16NumberToLittleEndianHex(-1, false)).toEqual('FFFF')
            expect(convertUInt16NumberToLittleEndianHex(255, false)).toEqual('FF00')
            expect(convertUInt16NumberToLittleEndianHex(511, false)).toEqual('FF01')
            expect(convertUInt16NumberToLittleEndianHex(1023, false)).toEqual('FF03')
            expect(convertUInt16NumberToLittleEndianHex(32767, false)).toEqual('FF7F')
            expect(convertUInt16NumberToLittleEndianHex(-32768, false)).toEqual('0080')
        })
    })

    describe('Function: bigIntLikeToBigInt', () => {
        it('should handle valid inputs', () => {
            expect(Converter.bigIntLikeToBigInt('0x')).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt('0')).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt(100)).toEqual(BigInt(100))
            expect(Converter.bigIntLikeToBigInt('123330')).toEqual(BigInt(123330))
        })
        it('should handle floats by truncating', () => {
            expect(Converter.bigIntLikeToBigInt(123.456)).toEqual(BigInt(123))
        })
        it('should handle scientific notation', () => {
            expect(Converter.bigIntLikeToBigInt('1e6')).toEqual(BigInt(1000000))
            expect(Converter.bigIntLikeToBigInt('1.23e3')).toEqual(BigInt(1230))
            expect(Converter.bigIntLikeToBigInt('-1e6')).toEqual(BigInt(-1000000))
            expect(Converter.bigIntLikeToBigInt('1.23e-3')).toEqual(BigInt(0))
        })
        it('should handle string representations of numbers', () => {
            expect(Converter.bigIntLikeToBigInt('123456789012345678901234567890')).toEqual(
                BigInt('123456789012345678901234567890')
            )
            expect(Converter.bigIntLikeToBigInt('-123456789012345678901234567890')).toEqual(
                BigInt('-123456789012345678901234567890')
            )
        })
        it('should handle edge cases', () => {
            expect(Converter.bigIntLikeToBigInt('')).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt(undefined)).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt(null)).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt(NaN)).toEqual(BigInt(0))
            expect(Converter.bigIntLikeToBigInt(false)).toEqual(BigInt(0))
        })
    })
})

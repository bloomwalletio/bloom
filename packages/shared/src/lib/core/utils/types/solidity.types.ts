import { BigNumber } from '@ethersproject/bignumber'
import sha3 from 'js-sha3'

abstract class DataStr {
    val: string
    constructor(val: string) {
        if (isNaN(Number(val))) throw Error('NaN. Not a valid input.')
        this.val = val.toString()
    }

    toString() {
        return this.val
    }

    toJSON() {
        return this.toString()
    }

    eq(n: DataStr): boolean {
        return this.toBigNumber().eq(n.toBigNumber())
    }

    abstract toBigNumber(): BigNumber
}

export class HexString extends DataStr {
    isHex = true
    constructor(val: string) {
        super(val)
        if (!this.val.startsWith('0x')) throw Error(`Invalid value. ${val} does not start with 0x`)
        if (this.val.length % 2 !== 0) {
            this.val = `0x0${this.val.substring(2)}`
        }
    }

    toBigNumber(): BigNumber {
        return BigNumber.from(this.val)
    }

    byteLength(): number {
        return Math.ceil((this.val.length - 2) / 2)
    }

    protected assertLength(len: number): void {
        const leftPadding = len * 2 - (this.val.length - 2)
        if (leftPadding < 0) throw `It has ${this.byteLength()} bytes`
        else if (leftPadding > 0) {
            const newVal = `0x${Array(leftPadding).fill('0').join('')}${this.val.slice(2)}`
            this.val = newVal
        }
    }

    static from(val: string): HexString {
        return new HexString(val)
    }

    toUintString(): UintString {
        return new UintString(this.toBigNumber().toString())
    }

    toBuffer(): Buffer {
        return Buffer.from(this.val.slice(2), 'hex')
    }
}

export class NumString extends DataStr {
    isNum = true
    constructor(val: string) {
        super(val)
        if (val.startsWith('0x')) throw Error(`It is not a number. ${val} starts with 0x.`)
        // always remove prefixed zeroes
        const prefix = this.val.startsWith('-') ? '-' : ''
        while (this.val.startsWith('0') && this.val.length > 1) {
            this.val = this.val.slice(1)
        }
        this.val = prefix + this.val
    }

    static from(val: string): NumString {
        return new NumString(val)
    }

    toBigNumber(): BigNumber {
        return BigNumber.from(this.val)
    }

    toBytes(): HexString {
        return new HexString(`0x${this.toBigNumber().toHexString()}`)
    }

    toBuffer(): Buffer {
        return this.toBytes().toBuffer()
    }
}

export type bytes = 'byte' | 'bytes2' | 'bytes3'

export class UintString extends NumString {
    isUint = true

    constructor(val: string) {
        super(val)
        if (this.val.startsWith('-')) throw Error('It can not have a negative number.')
    }

    assertThreshold(threshold: string): void {
        if (this.val.padStart(threshold.length, '0') >= threshold) {
            throw Error('Overflow.')
        }
    }

    static from(val: string): UintString {
        return new UintString(val)
    }

    toHexString(): HexString {
        return new HexString(`0x${this.toBigNumber().toHexString()}`)
    }
}

export class IntString extends NumString {
    isInt = true
    constructor(val: string) {
        super(val)
    }
    assertThreshold(threshold: string): void {
        if (this.val.startsWith('-')) {
            if (this.val.slice(1) > threshold) throw Error('Underflow.')
        } else {
            if (this.val >= threshold) throw Error('Overflow.')
        }
    }
    static from(val: string): IntString {
        return new IntString(val)
    }
}

export class Bytes extends HexString {
    isBytes = true

    constructor(val: string) {
        super(val)
    }

    static from(val: string): Bytes {
        return new Bytes(val)
    }
}

export class Byte extends HexString {
    isByte = true

    constructor(val: string) {
        super(val)
        this.assertLength(1)
    }

    static from(val: string): Byte {
        return new Byte(val)
    }

    toUint(): Uint8 {
        return new Uint8(this.toBigNumber().toString())
    }
}

export class Bytes2 extends HexString {
    isBytes2 = true

    constructor(val: string) {
        super(val)
        this.assertLength(2)
    }

    static from(val: string): Bytes2 {
        return new Bytes2(val)
    }

    toUint(): Uint16 {
        return new Uint16(this.toBigNumber().toString())
    }
}

export class Bytes3 extends HexString {
    isBytes3 = true

    constructor(val: string) {
        super(val)
        this.assertLength(3)
    }

    static from(val: string): Bytes3 {
        return new Bytes3(val)
    }

    toUint(): Uint24 {
        return new Uint24(this.toBigNumber().toString())
    }
}

export class Bytes4 extends HexString {
    isBytes4 = true

    constructor(val: string) {
        super(val)
        this.assertLength(4)
    }

    static from(val: string): Bytes4 {
        return new Bytes4(val)
    }

    toUint(): Uint32 {
        return new Uint32(this.toBigNumber().toString())
    }
}

export class Bytes5 extends HexString {
    isBytes5 = true

    constructor(val: string) {
        super(val)
        this.assertLength(5)
    }

    static from(val: string): Bytes5 {
        return new Bytes5(val)
    }

    toUint(): Uint40 {
        return new Uint40(this.toBigNumber().toString())
    }
}

export class Bytes6 extends HexString {
    isBytes6 = true

    constructor(val: string) {
        super(val)
        this.assertLength(6)
    }

    static from(val: string): Bytes6 {
        return new Bytes6(val)
    }

    toUint(): Uint48 {
        return new Uint48(this.toBigNumber().toString())
    }
}

export class Bytes7 extends HexString {
    isBytes7 = true

    constructor(val: string) {
        super(val)
        this.assertLength(7)
    }

    static from(val: string): Bytes7 {
        return new Bytes7(val)
    }

    toUint(): Uint56 {
        return new Uint56(this.toBigNumber().toString())
    }
}

export class Bytes8 extends HexString {
    isBytes8 = true

    constructor(val: string) {
        super(val)
        this.assertLength(8)
    }

    static from(val: string): Bytes8 {
        return new Bytes8(val)
    }

    toUint(): Uint64 {
        return new Uint64(this.toBigNumber().toString())
    }
}

export class Bytes9 extends HexString {
    isBytes9 = true

    constructor(val: string) {
        super(val)
        this.assertLength(9)
    }

    static from(val: string): Bytes9 {
        return new Bytes9(val)
    }

    toUint(): Uint72 {
        return new Uint72(this.toBigNumber().toString())
    }
}

export class Bytes10 extends HexString {
    isBytes10 = true

    constructor(val: string) {
        super(val)
        this.assertLength(10)
    }

    static from(val: string): Bytes10 {
        return new Bytes10(val)
    }

    toUint(): Uint80 {
        return new Uint80(this.toBigNumber().toString())
    }
}

export class Bytes11 extends HexString {
    isBytes11 = true

    constructor(val: string) {
        super(val)
        this.assertLength(11)
    }

    static from(val: string): Bytes11 {
        return new Bytes11(val)
    }

    toUint(): Uint88 {
        return new Uint88(this.toBigNumber().toString())
    }
}

export class Bytes12 extends HexString {
    isBytes12 = true

    constructor(val: string) {
        super(val)
        this.assertLength(12)
    }

    static from(val: string): Bytes12 {
        return new Bytes12(val)
    }

    toUint(): Uint96 {
        return new Uint96(this.toBigNumber().toString())
    }
}

export class Bytes13 extends HexString {
    isBytes13 = true

    constructor(val: string) {
        super(val)
        this.assertLength(13)
    }

    static from(val: string): Bytes13 {
        return new Bytes13(val)
    }

    toUint(): Uint104 {
        return new Uint104(this.toBigNumber().toString())
    }
}

export class Bytes14 extends HexString {
    isBytes14 = true

    constructor(val: string) {
        super(val)
        this.assertLength(14)
    }

    static from(val: string): Bytes14 {
        return new Bytes14(val)
    }

    toUint(): Uint112 {
        return new Uint112(this.toBigNumber().toString())
    }
}

export class Bytes15 extends HexString {
    isBytes15 = true

    constructor(val: string) {
        super(val)
        this.assertLength(15)
    }

    static from(val: string): Bytes15 {
        return new Bytes15(val)
    }

    toUint(): Uint120 {
        return new Uint120(this.toBigNumber().toString())
    }
}

export class Bytes16 extends HexString {
    isBytes16 = true

    constructor(val: string) {
        super(val)
        this.assertLength(16)
    }

    static from(val: string): Bytes16 {
        return new Bytes16(val)
    }

    toUint(): Uint128 {
        return new Uint128(this.toBigNumber().toString())
    }
}

export class Bytes17 extends HexString {
    isBytes17 = true

    constructor(val: string) {
        super(val)
        this.assertLength(17)
    }

    static from(val: string): Bytes17 {
        return new Bytes17(val)
    }

    toUint(): Uint136 {
        return new Uint136(this.toBigNumber().toString())
    }
}

export class Bytes18 extends HexString {
    isBytes18 = true

    constructor(val: string) {
        super(val)
        this.assertLength(18)
    }

    static from(val: string): Bytes18 {
        return new Bytes18(val)
    }

    toUint(): Uint144 {
        return new Uint144(this.toBigNumber().toString())
    }
}

export class Bytes19 extends HexString {
    isBytes19 = true

    constructor(val: string) {
        super(val)
        this.assertLength(19)
    }

    static from(val: string): Bytes19 {
        return new Bytes19(val)
    }

    toUint(): Uint152 {
        return new Uint152(this.toBigNumber().toString())
    }
}

export class Bytes20 extends HexString {
    isBytes20 = true

    constructor(val: string) {
        super(val)
        this.assertLength(20)
    }

    static from(val: string): Bytes20 {
        return new Bytes20(val)
    }

    toUint(): Uint160 {
        return new Uint160(this.toBigNumber().toString())
    }

    toAddress(): Address {
        return new Address(this.val)
    }
}

export class Bytes21 extends HexString {
    isBytes21 = true

    constructor(val: string) {
        super(val)
        this.assertLength(21)
    }

    static from(val: string): Bytes21 {
        return new Bytes21(val)
    }

    toUint(): Uint168 {
        return new Uint168(this.toBigNumber().toString())
    }
}

export class Bytes22 extends HexString {
    isBytes22 = true

    constructor(val: string) {
        super(val)
        this.assertLength(22)
    }

    static from(val: string): Bytes22 {
        return new Bytes22(val)
    }

    toUint(): Uint176 {
        return new Uint176(this.toBigNumber().toString())
    }
}

export class Bytes23 extends HexString {
    isBytes23 = true

    constructor(val: string) {
        super(val)
        this.assertLength(23)
    }

    static from(val: string): Bytes23 {
        return new Bytes23(val)
    }

    toUint(): Uint184 {
        return new Uint184(this.toBigNumber().toString())
    }
}

export class Bytes24 extends HexString {
    isBytes24 = true

    constructor(val: string) {
        super(val)
        this.assertLength(24)
    }

    static from(val: string): Bytes24 {
        return new Bytes24(val)
    }

    toUint(): Uint192 {
        return new Uint192(this.toBigNumber().toString())
    }
}

export class Bytes25 extends HexString {
    isBytes25 = true

    constructor(val: string) {
        super(val)
        this.assertLength(25)
    }

    static from(val: string): Bytes25 {
        return new Bytes25(val)
    }

    toUint(): Uint200 {
        return new Uint200(this.toBigNumber().toString())
    }
}

export class Bytes26 extends HexString {
    isBytes26 = true

    constructor(val: string) {
        super(val)
        this.assertLength(26)
    }

    static from(val: string): Bytes26 {
        return new Bytes26(val)
    }

    toUint(): Uint208 {
        return new Uint208(this.toBigNumber().toString())
    }
}

export class Bytes27 extends HexString {
    isBytes27 = true

    constructor(val: string) {
        super(val)
        this.assertLength(27)
    }

    static from(val: string): Bytes27 {
        return new Bytes27(val)
    }

    toUint(): Uint216 {
        return new Uint216(this.toBigNumber().toString())
    }
}

export class Bytes28 extends HexString {
    isBytes28 = true

    constructor(val: string) {
        super(val)
        this.assertLength(28)
    }

    static from(val: string): Bytes28 {
        return new Bytes28(val)
    }

    toUint(): Uint224 {
        return new Uint224(this.toBigNumber().toString())
    }
}

export class Bytes29 extends HexString {
    isBytes29 = true

    constructor(val: string) {
        super(val)
        this.assertLength(29)
    }

    static from(val: string): Bytes29 {
        return new Bytes29(val)
    }

    toUint(): Uint232 {
        return new Uint232(this.toBigNumber().toString())
    }
}

export class Bytes30 extends HexString {
    isBytes30 = true

    constructor(val: string) {
        super(val)
        this.assertLength(30)
    }

    static from(val: string): Bytes30 {
        return new Bytes30(val)
    }

    toUint(): Uint240 {
        return new Uint240(this.toBigNumber().toString())
    }
}

export class Bytes31 extends HexString {
    isBytes31 = true

    constructor(val: string) {
        super(val)
        this.assertLength(31)
    }

    static from(val: string): Bytes31 {
        return new Bytes31(val)
    }

    toUint(): Uint248 {
        return new Uint248(this.toBigNumber().toString())
    }
}

export class Bytes32 extends HexString {
    isBytes32 = true

    constructor(val: string) {
        super(val)
        this.assertLength(32)
    }

    static from(val: string): Bytes32 {
        return new Bytes32(val)
    }

    toUint(): Uint256 {
        return new Uint256(this.toBigNumber().toString())
    }
}

export class Uint8 extends UintString {
    isUint8 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('256')
    }
    static from(val: string): Uint8 {
        return new Uint8(val)
    }
    toByte(): Byte {
        return new Byte(this.toBigNumber().toHexString())
    }
}

export class Uint16 extends UintString {
    isUint16 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('65536')
    }
    static from(val: string): Uint16 {
        return new Uint16(val)
    }

    toBytes(): Bytes2 {
        return new Bytes2(this.toBigNumber().toHexString())
    }
}

export class Uint24 extends UintString {
    isUint24 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('16777216')
    }
    static from(val: string): Uint24 {
        return new Uint24(val)
    }
    toBytes(): Bytes3 {
        return new Bytes3(this.toBigNumber().toHexString())
    }
}

export class Uint32 extends UintString {
    isUint32 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('4294967296')
    }
    static from(val: string): Uint32 {
        return new Uint32(val)
    }
    toBytes(): Bytes4 {
        return new Bytes4(this.toBigNumber().toHexString())
    }
}

export class Uint40 extends UintString {
    isUint40 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1099511627776')
    }
    static from(val: string): Uint40 {
        return new Uint40(val)
    }
    toBytes(): Bytes5 {
        return new Bytes5(this.toBigNumber().toHexString())
    }
}

export class Uint48 extends UintString {
    isUint48 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('281474976710656')
    }
    static from(val: string): Uint48 {
        return new Uint48(val)
    }
    toBytes(): Bytes6 {
        return new Bytes6(this.toBigNumber().toHexString())
    }
}

export class Uint56 extends UintString {
    isUint56 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('72057594037927936')
    }
    static from(val: string): Uint56 {
        return new Uint56(val)
    }
    toBytes(): Bytes7 {
        return new Bytes7(this.toBigNumber().toHexString())
    }
}

export class Uint64 extends UintString {
    isUint64 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('18446744073709551616')
    }
    static from(val: string): Uint64 {
        return new Uint64(val)
    }
    toBytes(): Bytes8 {
        return new Bytes8(this.toBigNumber().toHexString())
    }
}

export class Uint72 extends UintString {
    isUint72 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('4722366482869645213696')
    }
    static from(val: string): Uint72 {
        return new Uint72(val)
    }
    toBytes(): Bytes9 {
        return new Bytes9(this.toBigNumber().toHexString())
    }
}

export class Uint80 extends UintString {
    isUint80 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1208925819614629174706176')
    }
    static from(val: string): Uint80 {
        return new Uint80(val)
    }
    toBytes(): Bytes10 {
        return new Bytes10(this.toBigNumber().toHexString())
    }
}

export class Uint88 extends UintString {
    isUint88 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('309485009821345068724781056')
    }
    static from(val: string): Uint88 {
        return new Uint88(val)
    }
    toBytes(): Bytes11 {
        return new Bytes11(this.toBigNumber().toHexString())
    }
}

export class Uint96 extends UintString {
    isUint96 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('79228162514264337593543950336')
    }
    static from(val: string): Uint96 {
        return new Uint96(val)
    }
    toBytes(): Bytes12 {
        return new Bytes12(this.toBigNumber().toHexString())
    }
}

export class Uint104 extends UintString {
    isUint104 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('20282409603651670423947251286016')
    }
    static from(val: string): Uint104 {
        return new Uint104(val)
    }
    toBytes(): Bytes13 {
        return new Bytes13(this.toBigNumber().toHexString())
    }
}

export class Uint112 extends UintString {
    isUint112 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('5192296858534827628530496329220096')
    }
    static from(val: string): Uint112 {
        return new Uint112(val)
    }
    toBytes(): Bytes14 {
        return new Bytes14(this.toBigNumber().toHexString())
    }
}

export class Uint120 extends UintString {
    isUint120 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1329227995784915872903807060280344576')
    }
    static from(val: string): Uint120 {
        return new Uint120(val)
    }
    toBytes(): Bytes15 {
        return new Bytes15(this.toBigNumber().toHexString())
    }
}

export class Uint128 extends UintString {
    isUint128 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('340282366920938463463374607431768211456')
    }
    static from(val: string): Uint128 {
        return new Uint128(val)
    }
    toBytes(): Bytes16 {
        return new Bytes16(this.toBigNumber().toHexString())
    }
}

export class Uint136 extends UintString {
    isUint136 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('87112285931760246646623899502532662132736')
    }
    static from(val: string): Uint136 {
        return new Uint136(val)
    }
    toBytes(): Bytes17 {
        return new Bytes17(this.toBigNumber().toHexString())
    }
}

export class Uint144 extends UintString {
    isUint144 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('22300745198530623141535718272648361505980416')
    }
    static from(val: string): Uint144 {
        return new Uint144(val)
    }
    toBytes(): Bytes18 {
        return new Bytes18(this.toBigNumber().toHexString())
    }
}

export class Uint152 extends UintString {
    isUint152 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('5708990770823839524233143877797980545530986496')
    }
    static from(val: string): Uint152 {
        return new Uint152(val)
    }
    toBytes(): Bytes19 {
        return new Bytes19(this.toBigNumber().toHexString())
    }
}

export class Uint160 extends UintString {
    isUint160 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1461501637330902918203684832716283019655932542976')
    }
    static from(val: string): Uint160 {
        return new Uint160(val)
    }
    toBytes(): Bytes20 {
        return new Bytes20(this.toBigNumber().toHexString())
    }
}

export class Uint168 extends UintString {
    isUint168 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('374144419156711147060143317175368453031918731001856')
    }
    static from(val: string): Uint168 {
        return new Uint168(val)
    }
    toBytes(): Bytes21 {
        return new Bytes21(this.toBigNumber().toHexString())
    }
}

export class Uint176 extends UintString {
    isUint176 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('95780971304118053647396689196894323976171195136475136')
    }
    static from(val: string): Uint176 {
        return new Uint176(val)
    }
    toBytes(): Bytes22 {
        return new Bytes22(this.toBigNumber().toHexString())
    }
}

export class Uint184 extends UintString {
    isUint184 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('24519928653854221733733552434404946937899825954937634816')
    }
    static from(val: string): Uint184 {
        return new Uint184(val)
    }
    toBytes(): Bytes23 {
        return new Bytes23(this.toBigNumber().toHexString())
    }
}

export class Uint192 extends UintString {
    isUint192 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('6277101735386680763835789423207666416102355444464034512896')
    }
    static from(val: string): Uint192 {
        return new Uint192(val)
    }
    toBytes(): Bytes24 {
        return new Bytes24(this.toBigNumber().toHexString())
    }
}

export class Uint200 extends UintString {
    isUint200 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1606938044258990275541962092341162602522202993782792835301376')
    }
    static from(val: string): Uint200 {
        return new Uint200(val)
    }
    toBytes(): Bytes25 {
        return new Bytes25(this.toBigNumber().toHexString())
    }
}

export class Uint208 extends UintString {
    isUint208 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('411376139330301510538742295639337626245683966408394965837152256')
    }
    static from(val: string): Uint208 {
        return new Uint208(val)
    }
    toBytes(): Bytes26 {
        return new Bytes26(this.toBigNumber().toHexString())
    }
}

export class Uint216 extends UintString {
    isUint216 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('105312291668557186697918027683670432318895095400549111254310977536')
    }
    static from(val: string): Uint216 {
        return new Uint216(val)
    }
    toBytes(): Bytes27 {
        return new Bytes27(this.toBigNumber().toHexString())
    }
}

export class Uint224 extends UintString {
    isUint224 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('26959946667150639794667015087019630673637144422540572481103610249216')
    }
    static from(val: string): Uint224 {
        return new Uint224(val)
    }
    toBytes(): Bytes28 {
        return new Bytes28(this.toBigNumber().toHexString())
    }
}

export class Uint232 extends UintString {
    isUint232 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('6901746346790563787434755862277025452451108972170386555162524223799296')
    }
    static from(val: string): Uint232 {
        return new Uint232(val)
    }
    toBytes(): Bytes29 {
        return new Bytes29(this.toBigNumber().toHexString())
    }
}

export class Uint240 extends UintString {
    isUint240 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('1766847064778384329583297500742918515827483896875618958121606201292619776')
    }
    static from(val: string): Uint240 {
        return new Uint240(val)
    }
    toBytes(): Bytes30 {
        return new Bytes30(this.toBigNumber().toHexString())
    }
}

export class Uint248 extends UintString {
    isUint248 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('452312848583266388373324160190187140051835877600158453279131187530910662656')
    }
    static from(val: string): Uint248 {
        return new Uint248(val)
    }
    toBytes(): Bytes31 {
        return new Bytes31(this.toBigNumber().toHexString())
    }
}

export class Uint256 extends UintString {
    isUint256 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('115792089237316195423570985008687907853269984665640564039457584007913129639936')
    }
    static from(val: string): Uint256 {
        return new Uint256(val)
    }
    toBytes(): Bytes32 {
        return new Bytes32(this.toBigNumber().toHexString())
    }
}

export class Int8 extends IntString {
    isInt8 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('128')
    }
    static from(val: string): Int8 {
        return new Int8(val)
    }
}

export class Int16 extends IntString {
    isInt16 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('32768')
    }
    static from(val: string): Int16 {
        return new Int16(val)
    }
}

export class Int24 extends IntString {
    isInt24 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('8388608')
    }
    static from(val: string): Int24 {
        return new Int24(val)
    }
}

export class Int32 extends IntString {
    isInt32 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('2147483648')
    }
    static from(val: string): Int32 {
        return new Int32(val)
    }
}

export class Int40 extends IntString {
    isInt40 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('549755813888')
    }
    static from(val: string): Int40 {
        return new Int40(val)
    }
}

export class Int48 extends IntString {
    isInt48 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('140737488355328')
    }
    static from(val: string): Int48 {
        return new Int48(val)
    }
}

export class Int56 extends IntString {
    isInt56 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('36028797018963968')
    }
    static from(val: string): Int56 {
        return new Int56(val)
    }
}

export class Int64 extends IntString {
    isInt64 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('9223372036854775808')
    }
    static from(val: string): Int64 {
        return new Int64(val)
    }
}

export class Int72 extends IntString {
    isInt72 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('2361183241434822606848')
    }
    static from(val: string): Int72 {
        return new Int72(val)
    }
}

export class Int80 extends IntString {
    isInt80 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('604462909807314587353088')
    }
    static from(val: string): Int80 {
        return new Int80(val)
    }
}

export class Int88 extends IntString {
    isInt88 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('154742504910672534362390528')
    }
    static from(val: string): Int88 {
        return new Int88(val)
    }
}

export class Int96 extends IntString {
    isInt96 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('39614081257132168796771975168')
    }
    static from(val: string): Int96 {
        return new Int96(val)
    }
}

export class Int104 extends IntString {
    isInt104 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('10141204801825835211973625643008')
    }
    static from(val: string): Int104 {
        return new Int104(val)
    }
}

export class Int112 extends IntString {
    isInt112 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('2596148429267413814265248164610048')
    }
    static from(val: string): Int112 {
        return new Int112(val)
    }
}

export class Int120 extends IntString {
    isInt120 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('664613997892457936451903530140172288')
    }
    static from(val: string): Int120 {
        return new Int120(val)
    }
}

export class Int128 extends IntString {
    isInt128 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('170141183460469231731687303715884105728')
    }
    static from(val: string): Int128 {
        return new Int128(val)
    }
}

export class Int136 extends IntString {
    isInt136 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('43556142965880123323311949751266331066368')
    }
    static from(val: string): Int136 {
        return new Int136(val)
    }
}

export class Int144 extends IntString {
    isInt144 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('11150372599265311570767859136324180752990208')
    }
    static from(val: string): Int144 {
        return new Int144(val)
    }
}

export class Int152 extends IntString {
    isInt152 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('2854495385411919762116571938898990272765493248')
    }
    static from(val: string): Int152 {
        return new Int152(val)
    }
}

export class Int160 extends IntString {
    isInt160 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('730750818665451459101842416358141509827966271488')
    }
    static from(val: string): Int160 {
        return new Int160(val)
    }
}

export class Int168 extends IntString {
    isInt168 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('187072209578355573530071658587684226515959365500928')
    }
    static from(val: string): Int168 {
        return new Int168(val)
    }
}

export class Int176 extends IntString {
    isInt176 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('47890485652059026823698344598447161988085597568237568')
    }
    static from(val: string): Int176 {
        return new Int176(val)
    }
}

export class Int184 extends IntString {
    isInt184 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('12259964326927110866866776217202473468949912977468817408')
    }
    static from(val: string): Int184 {
        return new Int184(val)
    }
}

export class Int192 extends IntString {
    isInt192 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('3138550867693340381917894711603833208051177722232017256448')
    }
    static from(val: string): Int192 {
        return new Int192(val)
    }
}

export class Int200 extends IntString {
    isInt200 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('803469022129495137770981046170581301261101496891396417650688')
    }
    static from(val: string): Int200 {
        return new Int200(val)
    }
}

export class Int208 extends IntString {
    isInt208 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('205688069665150755269371147819668813122841983204197482918576128')
    }
    static from(val: string): Int208 {
        return new Int208(val)
    }
}

export class Int216 extends IntString {
    isInt216 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('52656145834278593348959013841835216159447547700274555627155488768')
    }
    static from(val: string): Int216 {
        return new Int216(val)
    }
}

export class Int224 extends IntString {
    isInt224 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('13479973333575319897333507543509815336818572211270286240551805124608')
    }
    static from(val: string): Int224 {
        return new Int224(val)
    }
}

export class Int232 extends IntString {
    isInt232 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('3450873173395281893717377931138512726225554486085193277581262111899648')
    }
    static from(val: string): Int232 {
        return new Int232(val)
    }
}

export class Int240 extends IntString {
    isInt240 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('883423532389192164791648750371459257913741948437809479060803100646309888')
    }
    static from(val: string): Int240 {
        return new Int240(val)
    }
}

export class Int248 extends IntString {
    isInt248 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('226156424291633194186662080095093570025917938800079226639565593765455331328')
    }
    static from(val: string): Int248 {
        return new Int248(val)
    }
}

export class Int256 extends IntString {
    isInt256 = true
    constructor(val: string) {
        super(val)
        this.assertThreshold('57896044618658097711785492504343953926634992332820282019728792003956564819968')
    }
    static from(val: string): Int256 {
        return new Int256(val)
    }
}

export class Address extends Bytes20 {
    constructor(val: string) {
        super(val)
        this.val = Address.toChecksumAddress(val)
    }

    static from(val: string): Address {
        return new Address(val)
    }

    /**
     * @dev Check EIP-55 for the details
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md#implementation
     * @param address Ethereum 20 bytes address value
     */
    static toChecksumAddress(address: string): string {
        address = address.toLowerCase().replace('0x', '')
        const hash = sha3.keccak256.update(address).hex()
        let ret = '0x'
        for (let i = 0; i < address.length; i += 1) {
            if (parseInt(hash[i], 16) >= 8) {
                ret += address[i].toUpperCase()
            } else {
                ret += address[i]
            }
        }
        return ret
    }
}

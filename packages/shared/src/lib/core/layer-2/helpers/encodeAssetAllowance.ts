import { Converter } from '@iota/util.js'
import BigInteger from 'big-integer'

import {
    IPersistedAsset,
    NewTransactionType,
    TokenStandard,
    TokenTransactionData,
    NftTransactionData,
    TransactionData,
} from '@core/wallet'
import { SpecialStream } from '../classes'
import { Allowance } from '../enums'
import { specialNativeTokenAmountEncoding } from '../utils'

export function encodeAssetAllowance(transactionData: TransactionData): Uint8Array {
    const allowance = new SpecialStream()
    if (transactionData.type === NewTransactionType.TokenTransfer) {
        const asset = transactionData.asset
        if (asset?.standard === TokenStandard.BaseToken) {
            allowance.writeUInt8('encodedAllowance', Allowance.HasBaseTokens)
            encodeBaseTokenTransfer(allowance, transactionData.rawAmount)
        } else if (asset) {
            allowance.writeUInt8('encodedAllowance', Allowance.HasNativeTokens)
            encodeNativeTokenTransfer(allowance, asset, transactionData)
        }
    } else if (transactionData.type === NewTransactionType.NftTransfer) {
        allowance.writeUInt8('encodedAllowance', Allowance.hasNFTs)
        encodeNftTransfer(allowance, transactionData)
    }
    return allowance.finalBytes()
}

function encodeBaseTokenTransfer(buffer: SpecialStream, rawAmount: string): void {
    buffer.writeUInt64SpecialEncoding('baseTokenAmount', BigInteger(rawAmount))
}

function encodeNativeTokenTransfer(
    buffer: SpecialStream,
    asset: IPersistedAsset,
    transactionData: TokenTransactionData
): void {
    const { rawAmount } = transactionData
    buffer.writeUInt32SpecialEncoding('amountOfDifferentTokens', 1)
    const tokenIdBytes = Converter.hexToBytes(asset.id)
    buffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)

    const encodedAmount = specialNativeTokenAmountEncoding(BigInt(rawAmount))
    buffer.writeUInt32SpecialEncoding('nativeTokenAmountLength', encodedAmount.length)
    buffer.writeBytes('nativeTokenAmount', encodedAmount.length, encodedAmount)
}

function encodeNftTransfer(buffer: SpecialStream, transactionData: NftTransactionData): void {
    buffer.writeUInt32SpecialEncoding('nftAmount', 1)
    const nftIdBytes = Converter.hexToBytes(transactionData.nft.id)
    buffer.writeBytes('nftId', nftIdBytes.length, nftIdBytes)
}

import { Converter } from '@iota/util.js'
import BigInteger from 'big-integer'
import { IPersistedAsset, SendFlowType, SendFlowParameters, TokenTransferData } from '@core/wallet'
import { SpecialStream } from '../classes'
import { Allowance } from '../enums'
import { specialNativeTokenAmountEncoding } from '../utils'
import { INft } from '@core/nfts/interfaces'

export function encodeAssetAllowance(sendFlowParameters: SendFlowParameters): Uint8Array {
    const allowance = new SpecialStream()
    if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        allowance.writeUInt8('encodedAllowance', Allowance.HasBaseTokens)
        encodeBaseTokenTransfer(allowance, sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0')
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer && sendFlowParameters.tokenTransfer?.asset) {
        allowance.writeUInt8('encodedAllowance', Allowance.HasNativeTokens)
        encodeNativeTokenTransfer(allowance, sendFlowParameters.tokenTransfer?.asset, sendFlowParameters.tokenTransfer)
    } else if (sendFlowParameters.type === SendFlowType.NftTransfer && sendFlowParameters?.nft) {
        allowance.writeUInt8('encodedAllowance', Allowance.hasNFTs)
        encodeNftTransfer(allowance, sendFlowParameters.nft)
    }
    return allowance.finalBytes()
}

function encodeBaseTokenTransfer(buffer: SpecialStream, rawAmount: string): void {
    buffer.writeUInt64SpecialEncoding('baseTokenAmount', BigInteger(rawAmount))
}

function encodeNativeTokenTransfer(
    buffer: SpecialStream,
    asset: IPersistedAsset,
    tokenTransfer: TokenTransferData
): void {
    buffer.writeUInt32SpecialEncoding('amountOfDifferentTokens', 1)
    const tokenIdBytes = Converter.hexToBytes(asset.id)
    buffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)

    const encodedAmount = specialNativeTokenAmountEncoding(BigInt(tokenTransfer?.rawAmount ?? '0'))
    buffer.writeUInt32SpecialEncoding('nativeTokenAmountLength', encodedAmount.length)
    buffer.writeBytes('nativeTokenAmount', encodedAmount.length, encodedAmount)
}

function encodeNftTransfer(buffer: SpecialStream, nft: INft): void {
    buffer.writeUInt32SpecialEncoding('nftAmount', 1)
    const nftIdBytes = Converter.hexToBytes(nft.id)
    buffer.writeBytes('nftId', nftIdBytes.length, nftIdBytes)
}

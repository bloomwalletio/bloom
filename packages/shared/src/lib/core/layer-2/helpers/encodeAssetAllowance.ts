import { Nft } from '@core/nfts/interfaces'
import { IPersistedToken } from '@core/token/interfaces'
import { SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
import { Converter } from '@iota/util.js'
import { SpecialStream } from '../classes'
import { Allowance } from '../enums'
import { specialNativeTokenAmountEncoding } from './'

export function encodeAssetAllowance(sendFlowParameters: SendFlowParameters): Uint8Array {
    const allowance = new SpecialStream()
    if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        allowance.writeUInt8('encodedAllowance', Allowance.HasBaseTokens)
        encodeBaseTokenTransfer(allowance, sendFlowParameters.baseCoinTransfer?.rawAmount ?? BigInt('0'))
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer && sendFlowParameters.tokenTransfer?.token) {
        allowance.writeUInt8('encodedAllowance', Allowance.HasNativeTokens)
        encodeNativeTokenTransfer(allowance, sendFlowParameters.tokenTransfer?.token, sendFlowParameters.tokenTransfer)
    } else if (sendFlowParameters.type === SendFlowType.NftTransfer && sendFlowParameters?.nft) {
        allowance.writeUInt8('encodedAllowance', Allowance.hasNFTs)
        encodeNftTransfer(allowance, sendFlowParameters.nft)
    }
    return allowance.finalBytes()
}

function encodeBaseTokenTransfer(buffer: SpecialStream, rawAmount: bigint): void {
    if (rawAmount < BigInt(0)) {
        throw new Error('Base token amount is negative!')
    }
    buffer.writeUInt64SpecialEncoding('baseTokenAmount', rawAmount)
}

function encodeNativeTokenTransfer(
    buffer: SpecialStream,
    token: IPersistedToken,
    tokenTransfer: TokenTransferData
): void {
    buffer.writeUInt32SpecialEncoding('amountOfDifferentTokens', 1)
    const tokenIdBytes = Converter.hexToBytes(token.id)
    buffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)

    const rawTokenAmount = tokenTransfer?.rawAmount ?? BigInt(0)
    if (rawTokenAmount < BigInt(0)) {
        throw new Error('Native token amount is negative!')
    }
    const encodedAmount = specialNativeTokenAmountEncoding(rawTokenAmount)
    buffer.writeUInt32SpecialEncoding('nativeTokenAmountLength', encodedAmount.length)
    buffer.writeBytes('nativeTokenAmount', encodedAmount.length, encodedAmount)
}

function encodeNftTransfer(buffer: SpecialStream, nft: Nft): void {
    buffer.writeUInt32SpecialEncoding('nftAmount', 1)
    const nftIdBytes = Converter.hexToBytes(nft.id)
    buffer.writeBytes('nftId', nftIdBytes.length, nftIdBytes)
}

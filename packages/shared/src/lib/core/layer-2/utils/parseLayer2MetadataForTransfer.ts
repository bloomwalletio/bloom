import { Converter } from '@core/utils'
import { NFT_ID_BYTE_LENGTH } from '@core/nfts/constants'
import { ILayer2AssetAllowance, ILayer2TransferAllowanceMetadata } from '../interfaces'
import { CONTRACT_FUNCTIONS, TARGET_CONTRACTS } from '../constants'
import { Allowance } from '@core/layer-2/enums'
import { ReadSpecialStream } from '@core/layer-2/classes'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'

// Function to parse data from the L1 metadata, using the new encoding where the shimmer chainId is 1072
export function parseLayer2MetadataForTransfer(metadata: Uint8Array): ILayer2TransferAllowanceMetadata {
    const readStream = new ReadSpecialStream(metadata)
    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    // TODO: This is a temporary fix since now the gas is always 500000, when it varies, the length of the gas will change
    const gasLimit = readStream.readUIntNSpecialEncoding('gasLimit', 3)

    const smartContractParameters = parseSmartContractParameters(readStream)
    const ethereumAddress = '0x' + smartContractParameters['a'].substring(4)

    const allowance = parseAssetAllowance(readStream)

    return {
        senderContract: Converter.decimalToHex(senderContract),
        targetContract: TARGET_CONTRACTS[targetContract] ?? Converter.decimalToHex(targetContract),
        contractFunction: CONTRACT_FUNCTIONS[contractFunction] ?? Converter.decimalToHex(contractFunction),
        gasLimit: gasLimit.toString(),
        ethereumAddress,
        baseTokens: allowance?.baseTokens,
        nativeTokens: allowance?.nativeTokens,
        nfts: allowance?.nfts,
    }
}

function parseSmartContractParameters(readStream: ReadSpecialStream): Record<string, string> {
    const smartContractParametersAmount = readStream.readUInt32SpecialEncoding('parametersLength')
    const smartContractParameters: Record<string, string> = {}

    for (let index = 0; index < smartContractParametersAmount; index++) {
        const keyLength = readStream.readUInt32SpecialEncoding('keyLength')
        const keyBytes = readStream.readBytes('keyValue', Number(keyLength))

        const valueLength = readStream.readUInt32SpecialEncoding('valueLength')
        const valueBytes = readStream.readBytes('valueBytes', Number(valueLength))

        const key = Converter.bytesToUtf8(keyBytes)
        const value = Converter.bytesToHex(valueBytes)

        smartContractParameters[key] = value
    }

    return smartContractParameters
}

function parseAssetAllowance(readStream: ReadSpecialStream): ILayer2AssetAllowance {
    const allowance = readStream.readUInt8('encodedAllowance')
    const result: ILayer2AssetAllowance = {
        baseTokens: '0',
        nativeTokens: [],
        nfts: [],
    }

    switch (allowance) {
        case Allowance.HasBaseTokens: {
            // TODO: This is a temporary fix since now the base token is sent alone in the transfer (without native token and/or nfts)
            const baseTokenLength = readStream.length() - readStream.getReadIndex()
            result.baseTokens = readStream.readUIntNSpecialEncoding('baseTokenAmount', baseTokenLength).toString()
            break
        }

        case Allowance.HasNativeTokens: {
            readStream.readUInt32SpecialEncoding('amountOfDifferentTokens')
            const tokenId = readStream.readBytes('tokenId', TOKEN_ID_BYTE_LENGTH)
            const tokenAmount = readStream.readUInt32SpecialEncoding('nativeTokenAmountLength')
            const nativeTokenAmount = readStream.readBytes('nativeTokenAmount', Number(tokenAmount))
            result.nativeTokens.push({ ID: [Converter.bytesToHex(tokenId)], amount: nativeTokenAmount.toString() })
            break
        }

        case Allowance.hasNFTs: {
            readStream.readUInt16SpecialEncoding('nftAmount')
            const nftIdBytes = readStream.readBytes('nftId', NFT_ID_BYTE_LENGTH)
            const nftId = Converter.bytesToHex(nftIdBytes)
            result.nfts.push(nftId)
            break
        }

        default:
            throw new Error('Smart contract call data does not set the asset allowance!')
    }
    return result
}

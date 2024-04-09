import { HEX_PREFIX } from '@core/utils'
import type { SendFlowParameters } from '@core/wallet/types'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_LIMIT_MULTIPLIER, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import { getChain } from '@core/network'

export function getLayer2MetadataForTransfer(sendFlowParameters: SendFlowParameters): string {
    const metadataStream = new SpecialStream()
    const chain = sendFlowParameters.destinationNetworkId
        ? getChain(sendFlowParameters.destinationNetworkId)
        : undefined
    if (!chain) {
        throw new Error('Chain is undefined')
    }
    const address = sendFlowParameters.recipient?.address ?? ''
    const encodedAddress = encodeAddress(address.toLowerCase(), chain)

    const estimatedGas = sendFlowParameters.gasFee ?? BigInt(0)
    const gasLimit = Math.floor(Number(estimatedGas) * GAS_LIMIT_MULTIPLIER)

    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)

    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    // Gas budget is the ISC equivalent of gas limit in ethereum and what we use throughout the code
    metadataStream.writeUInt64SpecialEncoding('gasLimit', BigInt(gasLimit))

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(sendFlowParameters)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return HEX_PREFIX + metadataStream.finalHex()
}

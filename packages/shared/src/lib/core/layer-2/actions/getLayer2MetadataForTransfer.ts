import { HEX_PREFIX } from '@core/utils'
import type { SendFlowParameters } from '@core/wallet/types'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import { getIscChain } from '@core/network'
import { addGasBuffer } from '../utils'

export function getLayer2MetadataForTransfer(sendFlowParameters: SendFlowParameters): string {
    const metadataStream = new SpecialStream()
    const iscChain = sendFlowParameters.destinationNetworkId
        ? getIscChain(sendFlowParameters.destinationNetworkId)
        : undefined
    if (!iscChain) {
        throw new Error('Chain is undefined')
    }
    const address = sendFlowParameters.recipient?.address ?? ''
    const encodedAddress = encodeAddress(address.toLowerCase(), iscChain)

    const gasFee = sendFlowParameters.gasFee ?? BigInt(0)
    const gasPerToken = iscChain.getMetadata()?.gasFeePolicy.gasPerToken
    let gasLimit: bigint
    if (gasPerToken) {
        // More information can be found here: https://wiki.iota.org/isc/reference/core-contracts/governance/#ratio32
        gasLimit = (gasFee * BigInt(gasPerToken['a'])) / BigInt(gasPerToken['b'])
    } else {
        gasLimit = addGasBuffer(gasFee)
    }

    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)

    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    // Gas budget is the ISC equivalent of gas limit in ethereum and what we use throughout the code
    metadataStream.writeUInt64SpecialEncoding('gasLimit', gasLimit)

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(sendFlowParameters)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return HEX_PREFIX + metadataStream.finalHex()
}

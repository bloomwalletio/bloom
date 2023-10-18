import { HEX_PREFIX } from '@core/utils'
import type { SendFlowParameters, TokenSendFlowParameters } from '@core/wallet/types'
import BigInteger from 'big-integer'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_LIMIT_MULTIPLIER, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import { estimateGasForLayer1ToLayer2Transaction } from './estimateGasForLayer1ToLayer2Transaction'
import { getChainConfiguration } from '@core/network'

export async function getLayer2MetadataForTransfer(sendFlowParameters: SendFlowParameters): Promise<string> {
    const metadataStream = new SpecialStream()
    const chainConfig = sendFlowParameters.destinationNetworkId
        ? getChainConfiguration(sendFlowParameters.destinationNetworkId)
        : undefined
    if (!chainConfig) {
        throw new Error('Chain is undefined')
    }
    const address = sendFlowParameters.recipient?.address ?? ''
    const encodedAddress = encodeAddress(address.toLowerCase(), chainConfig)

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters as TokenSendFlowParameters)
    const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)

    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)

    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    // Gas budget is the ISC equivalent of gas limit in ethereum and what we use throughout the code
    metadataStream.writeUInt64SpecialEncoding('gasLimit', BigInteger(gasLimit))

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(sendFlowParameters)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return HEX_PREFIX + metadataStream.finalHex()
}

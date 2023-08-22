import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import BigInteger from 'big-integer'
import type { SendFlowParameters, TokenSendFlowParameters } from '@core/wallet/types'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_MULTIPLIER, TRANSFER_ALLOWANCE } from '../constants'
import { estimateGasForLayer1ToLayer2Transaction } from './estimateGasForLayer1ToLayer2Transaction'

export async function getLayer2MetadataForTransfer(sendFlowParameters: SendFlowParameters): Promise<string> {
    const metadataStream = new SpecialStream()

    const address = sendFlowParameters.recipient?.address
    const encodedAddress = address ? encodeAddress(address.toLowerCase()) : ''

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters as TokenSendFlowParameters)
    const gasLimit = estimatedGas * GAS_MULTIPLIER

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    // Gas budget is the ISC equivalent of gas limit in ethereum and what we use throughout the code
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(gasLimit))

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(sendFlowParameters)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return '0x' + metadataStream.finalHex()
}

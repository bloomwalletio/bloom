import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import BigInteger from 'big-integer'
import type { TransactionData } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '../constants'
import { estimateGasForLayer1ToLayer2Transaction } from './estimateGasForLayer1ToLayer2Transaction'

export async function getLayer2MetadataForTransfer(transactionData: TransactionData): Promise<string> {
    const metadataStream = new SpecialStream()

    const address = getAddressFromSubject(transactionData.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(transactionData)

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(estimatedGas) ?? GAS_BUDGET)

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(transactionData)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return '0x' + metadataStream.finalHex()
}

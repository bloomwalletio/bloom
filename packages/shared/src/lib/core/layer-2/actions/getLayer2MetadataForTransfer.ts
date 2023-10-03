import { HEX_PREFIX } from '@core/utils'
import type { SendFlowParameters, TokenSendFlowParameters } from '@core/wallet/types'
import BigInteger from 'big-integer'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_LIMIT_MULTIPLIER, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import { estimateGasForLayer1ToLayer2Transaction } from './estimateGasForLayer1ToLayer2Transaction'
import { EvmChainId, IChain, NetworkId, getNetwork } from '@core/network'

export async function getLayer2MetadataForTransfer(sendFlowParameters: SendFlowParameters): Promise<string> {
    const metadataStream = new SpecialStream()
    const chain = getChain(sendFlowParameters.destinationNetworkId)
    const { chainId } = chain.getConfiguration()

    const address = sendFlowParameters.recipient?.address ?? ''
    const encodedAddress = encodeAddress(address.toLowerCase(), chain)

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters as TokenSendFlowParameters)
    const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)

    // TODO: use writeUInt8 once EVM Testnet encoding reaches parity with ShimmerEVM
    if (chainId === EvmChainId.ShimmerEvmTestnet) {
        metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    } else {
        metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    }

    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    // Gas budget is the ISC equivalent of gas limit in ethereum and what we use throughout the code
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(gasLimit))

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(sendFlowParameters)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return HEX_PREFIX + metadataStream.finalHex()
}

function getChain(networkId: NetworkId | undefined): IChain {
    if (!networkId) {
        throw new Error('Destination Network for L2 transaction is undefined!')
    }
    const chain = getNetwork()?.getChain(networkId)
    if (!chain) {
        throw new Error('fdsafsa')
    }
    return chain
}

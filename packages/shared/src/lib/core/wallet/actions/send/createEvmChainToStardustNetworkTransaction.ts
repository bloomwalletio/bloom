import Web3 from 'web3'

import { IAccountState } from '@core/account/interfaces'
import { buildEvmTransactionData, buildUnwrapAssetParameters } from '@core/layer-2/actions'
import { FALLBACK_ESTIMATED_GAS, ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { ContractType } from '@core/layer-2/enums'
import { EvmTransactionData } from '@core/layer-2/types'
import { buildAssetAllowance } from '@core/layer-2/utils'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'
import { IChain } from '@core/network/interfaces'

import { SendFlowType } from '../../stores'
import { SendFlowParameters } from '../../types'
import { buildTransferredAssetFromSendFlowParameters } from '../../utils'

export async function createEvmChainToStardustNetworkTransaction(
    sendFlowParameters: SendFlowParameters,
    chain: IChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    const recipientAddress = sendFlowParameters.recipient?.address
    if (recipientAddress) {
        const { targetAddress, adjustMinimumStorageDeposit, sendMetadata, sendOptions } =
            buildUnwrapAssetParameters(recipientAddress)

        const transferredAsset = buildTransferredAssetFromSendFlowParameters(sendFlowParameters)
        if (transferredAsset) {
            const assetAllowance = buildAssetAllowance(
                transferredAsset,
                FALLBACK_ESTIMATED_GAS[SendFlowType.TokenUnwrap]
            )
            const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
            const data =
                (await contract?.methods
                    .send(targetAddress, assetAllowance, adjustMinimumStorageDeposit, sendMetadata, sendOptions)
                    .encodeABI()) ?? ''

            const provider = chain?.getProvider() as Web3
            const originAddress = account?.evmAddresses?.[ETHEREUM_COIN_TYPE] ?? ''
            return await buildEvmTransactionData(provider, originAddress, ISC_MAGIC_CONTRACT_ADDRESS, '0', data)
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

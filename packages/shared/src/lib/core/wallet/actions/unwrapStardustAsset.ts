import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'

import { getSelectedAccountIndex } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import {
    ContractType,
    ISC_MAGIC_CONTRACT_ADDRESS,
    buildEvmTransactionData,
    ILayer2AssetAllowance,
    buildUnwrapAssetParameters,
} from '@core/layer-2'
import { ETHEREUM_COIN_TYPE, IChain, getNetwork, SupportedNetworkId, NetworkId } from '@core/network'
import { getActiveProfilePersistedEvmAddressesByAccountIndex } from '@core/profile/stores'

import { sendTransactionFromEvm } from '../actions/send'

export async function unwrapStardustAsset(
    assetAllowance: ILayer2AssetAllowance,
    recipientAddress: string
): Promise<TransactionReceipt | undefined> {
    try {
        const { targetAddress, adjustMinimumStorageDeposit, sendMetadata, sendOptions } =
            buildUnwrapAssetParameters(recipientAddress)

        const chain = getNetwork()?.getChain(SupportedNetworkId.ShimmerEvmTestnet as NetworkId)
        const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const data =
            (await contract?.methods
                .send(targetAddress, assetAllowance, adjustMinimumStorageDeposit, sendMetadata, sendOptions)
                .encodeABI()) ?? ''

        const provider = chain?.getProvider() as Web3
        const originAddress =
            getActiveProfilePersistedEvmAddressesByAccountIndex(getSelectedAccountIndex())?.[ETHEREUM_COIN_TYPE] ?? ''
        const transactionData = await buildEvmTransactionData(
            provider,
            originAddress,
            ISC_MAGIC_CONTRACT_ADDRESS,
            '0',
            data
        )
        const tx = await sendTransactionFromEvm(transactionData, chain as IChain)
        return tx
    } catch (err) {
        handleError(err)
    }
}

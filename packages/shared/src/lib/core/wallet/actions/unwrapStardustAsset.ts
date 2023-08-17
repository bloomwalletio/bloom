import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'

import { getSelectedAccountIndex } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import {
    ContractType,
    ISC_MAGIC_CONTRACT_ADDRESS,
    buildEvmTransactionData,
    IAssetAllowance,
    buildUnwrapAssetParameters,
} from '@core/layer-2'
import { ChainId, ETH_COIN_TYPE, IChain, getNetwork } from '@core/network'
import { getActiveProfilePersistedEvmAddressesByAccountIndex } from '@core/profile/stores'

import { sendTransactionFromEvm } from '../actions/send'

export async function unwrapStardustAsset(
    assetAllowance: IAssetAllowance,
    recipientAddress: string
): Promise<TransactionReceipt | undefined> {
    try {
        const parameters = buildUnwrapAssetParameters(assetAllowance, recipientAddress)

        const chain = getNetwork()?.getChain(ChainId.ShimmerEVM)
        const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const data = (await contract?.methods.send(...parameters).encodeABI()) ?? ''

        const provider = chain?.getProvider() as Web3
        const originAddress =
            getActiveProfilePersistedEvmAddressesByAccountIndex(getSelectedAccountIndex())?.[ETH_COIN_TYPE] ?? ''
        const transactionData = await buildEvmTransactionData(
            provider,
            originAddress,
            ISC_MAGIC_CONTRACT_ADDRESS,
            '0',
            data
        )

        return await sendTransactionFromEvm(transactionData, chain as IChain)
    } catch (err) {
        handleError(err)
    }
}

import { getSelectedAccountIndex } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { ContractType, ILayer2AssetAllowance, ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2'
import { buildEvmTransactionData, buildUnwrapAssetParameters } from '@core/layer-2/actions'
import { ETHEREUM_COIN_TYPE, IChain, NetworkId, SupportedNetworkId, getNetwork } from '@core/network'
import { getActiveProfilePersistedEvmAddressesByAccountIndex } from '@core/profile/stores'
import Web3 from 'web3'
import { sendTransactionFromEvm } from '../actions/send'

export async function unwrapStardustAsset(
    tokenId: string,
    assetAllowance: ILayer2AssetAllowance,
    recipientAddress: string
): Promise<void> {
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
        await sendTransactionFromEvm(transactionData, tokenId, chain as IChain)
    } catch (err) {
        handleError(err)
    }
}

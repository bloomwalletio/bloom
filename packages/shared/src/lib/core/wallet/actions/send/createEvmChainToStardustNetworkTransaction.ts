import Web3 from 'web3'

import { IAccountState } from '@core/account/interfaces'
import { localize } from '@core/i18n'
import { buildEvmTransactionData, buildUnwrapAssetParameters } from '@core/layer-2/actions'
import { FALLBACK_ESTIMATED_GAS, ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { AssetType, ContractType, EvmErrorMessage } from '@core/layer-2/enums'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import { buildAssetAllowance } from '@core/layer-2/utils'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'
import { IChain } from '@core/network/interfaces'

import { TokenStandard } from '@core/token/enums'
import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils'

export async function createEvmChainToStardustNetworkTransaction(
    sendFlowParameters: SendFlowParameters,
    chain: IChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    try {
        const recipientAddress = sendFlowParameters.recipient?.address
        if (!recipientAddress) {
            return undefined
        }

        const { targetAddress, adjustMinimumStorageDeposit, sendMetadata, sendOptions } =
            buildUnwrapAssetParameters(recipientAddress)

        const { token, amount } = getAmountAndTokenFromSendFlowParameters(sendFlowParameters)
        const isBaseCoin = token.standard === TokenStandard.BaseToken
        const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
        const transferredAsset = { type: assetType, token, amount } as TransferredAsset

        const assetAllowance = buildAssetAllowance(transferredAsset, FALLBACK_ESTIMATED_GAS[SendFlowType.TokenUnwrap])
        const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const data =
            (await contract?.methods
                .send(targetAddress, assetAllowance, adjustMinimumStorageDeposit, sendMetadata, sendOptions)
                .encodeABI()) ?? ''

        const provider = chain?.getProvider() as Web3
        const originAddress = account?.evmAddresses?.[ETHEREUM_COIN_TYPE] ?? ''
        return await buildEvmTransactionData(provider, originAddress, ISC_MAGIC_CONTRACT_ADDRESS, '0', data)
    } catch (err) {
        if (err.message && err.message.includes(EvmErrorMessage.RequireMoreGas)) {
            throw new Error(localize('error.send.insufficientFundsGasFee'))
        } else {
            throw err
        }
    }
}

import { IAccountState } from '@core/account/interfaces'
import { localize } from '@core/i18n'
import { buildUnwrapAssetParameters } from '@core/layer-2/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, L2_TO_L1_STORAGE_DEPOSIT_BUFFER } from '@core/layer-2/constants'
import { AssetType, ContractType, EvmErrorMessage } from '@core/layer-2/enums'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import { buildAssetAllowance, buildEvmTransactionData } from '@core/layer-2/utils'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'
import { IChain } from '@core/network/interfaces'

import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils'
import { TokenStandard } from '@core/token/enums'
import { IIrc27Nft } from '@core/nfts'

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

        let transferredAsset: TransferredAsset | undefined
        let storageDepositRequired = BigInt(0)
        if (
            sendFlowParameters.type === SendFlowType.TokenTransfer ||
            sendFlowParameters.type === SendFlowType.BaseCoinTransfer
        ) {
            const { token, amount } = getAmountAndTokenFromSendFlowParameters(sendFlowParameters)
            const isBaseCoin = token?.standard === TokenStandard.BaseToken
            const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
            storageDepositRequired = L2_TO_L1_STORAGE_DEPOSIT_BUFFER[SendFlowType.TokenUnwrap] ?? BigInt(0)
            transferredAsset = token && amount ? { type: assetType, token, amount } : undefined
        } else {
            const nft = sendFlowParameters.nft as IIrc27Nft
            storageDepositRequired =
                (nft?.storageDeposit ?? BigInt(0)) +
                (L2_TO_L1_STORAGE_DEPOSIT_BUFFER[SendFlowType.NftUnwrap] ?? BigInt(0))
            transferredAsset = nft ? { type: AssetType.Nft, nft } : undefined
        }

        if (!transferredAsset) {
            return
        }

        const assetAllowance = buildAssetAllowance(transferredAsset, storageDepositRequired)
        const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const data =
            (await contract?.methods
                .send(targetAddress, assetAllowance, adjustMinimumStorageDeposit, sendMetadata, sendOptions)
                .encodeABI()) ?? ''

        const originAddress = account?.evmAddresses?.[ETHEREUM_COIN_TYPE] ?? ''
        return await buildEvmTransactionData(chain, originAddress, ISC_MAGIC_CONTRACT_ADDRESS, BigInt(0), data)
    } catch (err) {
        if (err.message && err.message.includes(EvmErrorMessage.RequireMoreGas)) {
            throw new Error(localize('error.send.insufficientFundsGasFee'))
        } else {
            throw err
        }
    }
}

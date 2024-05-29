import { IAccountState } from '@core/account/interfaces'
import { IError } from '@core/error'
import { localize } from '@core/i18n'
import { IscMagicContracts } from '@core/isc/classes/isc-magic-contracts.class'
import { buildUnwrapAssetParameters } from '@core/layer-2/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { AssetType, EvmErrorMessage } from '@core/layer-2/enums'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import { buildEvmTransactionData, getL2ToL1StorageDepositBuffer } from '@core/layer-2/utils'
import { IscChain } from '@core/network'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'
import { IIscChain } from '@core/network/interfaces'
import { StardustNetworkId } from '@core/network/types'
import { IIrc27Nft } from '@core/nfts'
import { getTokenBalance } from '@core/token/actions'
import { TokenStandard } from '@core/token/enums'
import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils'
import { buildIscAssets, buildIscL1AddressFromBech32Address } from '@core/isc/utils'

export async function createEvmToStardustTransaction(
    sendFlowParameters: SendFlowParameters,
    iscChain: IIscChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    try {
        const recipientAddress = sendFlowParameters.recipient?.address
        if (!recipientAddress) {
            return undefined
        }
        let maximumGasLimit: bigint = BigInt(0)

        let transferredAsset: TransferredAsset | undefined
        let storageDepositRequired = BigInt(0)

        const { type, destinationNetworkId } = sendFlowParameters
        if (type === SendFlowType.TokenTransfer || type === SendFlowType.BaseCoinTransfer) {
            const { token, amount } = getAmountAndTokenFromSendFlowParameters(sendFlowParameters)
            const isBaseCoin = token?.standard === TokenStandard.BaseToken
            const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
            storageDepositRequired = getL2ToL1StorageDepositBuffer(
                SendFlowType.TokenUnwrap,
                destinationNetworkId as StardustNetworkId
            )
            transferredAsset = token && amount ? { type: assetType, token, amount } : undefined
            if (token?.standard === TokenStandard.BaseToken && amount) {
                const availableBalance = getTokenBalance(token.id, iscChain.id)?.available ?? BigInt(0)
                maximumGasLimit = availableBalance - amount
            }
        } else {
            const nft = sendFlowParameters.nft as IIrc27Nft
            storageDepositRequired =
                (nft?.storageDeposit ?? BigInt(0)) +
                getL2ToL1StorageDepositBuffer(SendFlowType.NftUnwrap, destinationNetworkId as StardustNetworkId)
            transferredAsset = nft ? { type: AssetType.Nft, nft } : undefined
        }

        if (!transferredAsset) {
            return
        }

        const targetAddress = buildIscL1AddressFromBech32Address(recipientAddress)
        const assets = buildIscAssets(iscChain, transferredAsset, storageDepositRequired)
        const { sendMetadata, sendOptions } = buildUnwrapAssetParameters()

        const magicContracts = new IscMagicContracts(iscChain as IscChain)
        const data =
            (await magicContracts.sandbox.encode('send', {
                targetAddress,
                assets,
                adjustMinimumStorageDeposit: false,
                sendMetadata,
                sendOptions,
            })) ?? ''

        const originAddress = account?.evmAddresses?.[ETHEREUM_COIN_TYPE] ?? ''
        const evmTransactionData = await buildEvmTransactionData(
            iscChain,
            originAddress,
            ISC_MAGIC_CONTRACT_ADDRESS,
            BigInt(0),
            data
        )
        evmTransactionData.gasLimit =
            maximumGasLimit > BigInt(0)
                ? Math.min(Number(evmTransactionData.gasLimit), Number(maximumGasLimit))
                : evmTransactionData.gasLimit
        return evmTransactionData
    } catch (err) {
        const error = err as IError
        if (error.message && error.message.includes(EvmErrorMessage.RequireMoreGas)) {
            throw new Error(localize('error.send.insufficientFundsGasFee'))
        } else {
            throw err
        }
    }
}

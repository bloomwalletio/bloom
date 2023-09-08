import { WEI_PER_GLOW } from '@core/layer-2'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import Web3 from 'web3'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { PersistedEvmTransaction, TransactionActivity } from '../types'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    tokenId: string,
    networkId: NetworkId,
    provider: Web3
): Promise<TransactionActivity> {
    const direction = ActivityDirection.Outgoing // Currently only sent transactions are supported

    const subject = getSubjectFromAddress(transaction.to, networkId)
    const isInternal = isSubjectInternal(subject)
    const timestamp = (await provider.eth.getBlock(transaction.blockNumber)).timestamp
    return {
        type: ActivityType.Basic,
        id: transaction.transactionHash,
        transactionId: transaction.transactionHash,
        time: new Date(Number(timestamp) * 1000),
        inclusionState: InclusionState.Confirmed,
        containsValue: true,
        isAssetHidden: false,
        direction,
        action: ActivityAction.Send,
        isInternal,
        storageDeposit: 0,
        transactionFee: Number(calculateGasFeeInGlow(transaction.gasUsed, transaction.gasPrice ?? 0)),
        subject,
        rawBaseCoinAmount: Number(transaction.value) / Number(WEI_PER_GLOW),
        rawAmount: Number(transaction.value) / Number(WEI_PER_GLOW),
        tokenId: BASE_TOKEN_ID,
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
    }
}

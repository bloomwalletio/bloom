import { PersistedEvmTransaction, TransactionActivity } from '../types'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { WEI_PER_GLOW } from '@core/layer-2'
import Web3 from 'web3'
import { NetworkId } from '@core/network/types'
import { getCoinType } from '@core/profile/actions'

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
        gasUsed: transaction.gasUsed,
        subject,
        rawBaseCoinAmount: Number(transaction.value) / Number(WEI_PER_GLOW),
        rawAmount: Number(transaction.value) / Number(WEI_PER_GLOW),
        tokenId: tokenId === '0x' ? getCoinType() : tokenId,
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
    }
}

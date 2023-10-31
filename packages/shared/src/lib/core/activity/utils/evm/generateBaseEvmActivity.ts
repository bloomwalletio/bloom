import { NetworkId } from '@core/network/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../../enums'
import { BaseEvmActivity, PersistedEvmTransaction } from '../../types'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'
import { IChain } from '@core/network'
import { IAccountState } from '@core/account/interfaces'
import { getAddressFromAccountForNetwork } from '@core/account/utils'

export async function generateBaseEvmActivity(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain,
    recipientAddress: string | undefined,
    account: IAccountState
): Promise<BaseEvmActivity> {
    const provider = chain.getProvider()

    const direction =
        getAddressFromAccountForNetwork(account, networkId) === recipientAddress
            ? ActivityDirection.Incoming
            : ActivityDirection.Outgoing

    const sender = getSubjectFromAddress(transaction.from, networkId)
    const recipient = getSubjectFromAddress(recipientAddress ?? transaction.to, networkId)

    const subject = direction === ActivityDirection.Outgoing ? recipient : sender
    const isInternal = isSubjectInternal(recipient)
    const timestamp = (await provider.eth.getBlock(transaction.blockNumber)).timestamp
    const transactionFee = transaction.gasPrice
        ? Number(calculateGasFeeInGlow(transaction.gasUsed, transaction.gasPrice))
        : undefined

    return {
        // meta information
        id: transaction.transactionHash,
        action: ActivityAction.Send,
        containsValue: true, // TODO: check if why we do this

        // transaction information
        transactionId: transaction.transactionHash,
        time: new Date(Number(timestamp) * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId, // TODO: what if sending to L1 ?
        sender,
        recipient,
        subject,
        direction,
        isInternal,

        transactionFee,
    }
}

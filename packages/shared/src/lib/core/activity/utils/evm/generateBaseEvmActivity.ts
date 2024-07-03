import { IAccountState } from '@core/account/interfaces'
import { getAddressFromAccountForNetwork } from '@core/account/utils'
import { IEvmNetwork, NetworkNamespace, calculateGasFee } from '@core/network'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../../enums'
import { BaseEvmActivity } from '../../types'
import { LocalEvmTransaction } from '@core/transactions'

export async function generateBaseEvmActivity(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<BaseEvmActivity> {
    const networkId = evmNetwork.id
    const recipientAddress = transaction.recipient ?? transaction.to

    const direction =
        getAddressFromAccountForNetwork(account, networkId) === recipientAddress
            ? ActivityDirection.Incoming
            : ActivityDirection.Outgoing

    const sender = getSubjectFromAddress(transaction.from, networkId)
    const recipient = getSubjectFromAddress(recipientAddress, networkId)

    const subject = direction === ActivityDirection.Outgoing ? recipient : sender
    const isInternal = isSubjectInternal(recipient)
    const timestamp = transaction.timestamp ?? (await getTimeStamp(transaction.blockNumber, evmNetwork))

    // For native token transfers on L2, gasUsed is 0. Therefor we fallback to the estimatedGas
    // https://discord.com/channels/397872799483428865/930642258427019354/1168854453005332490
    const gasUsed = transaction.gasUsed || transaction.estimatedGas
    const transactionFee = transaction.gasPrice ? calculateGasFee(gasUsed, transaction.gasPrice) : undefined
    const inclusionState =
        Number(transaction.confirmations) >= evmNetwork.blocksUntilConfirmed
            ? InclusionState.Confirmed
            : InclusionState.Pending

    return {
        namespace: NetworkNamespace.Evm,

        // meta information
        id: transaction.transactionHash,
        action: ActivityAction.Send,
        isSpam: false,

        // transaction information
        transactionId: transaction.transactionHash,
        time: new Date(timestamp),
        inclusionState,

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

async function getTimeStamp(blockNumber: number, evmNetwork: IEvmNetwork): Promise<number> {
    const { timestamp } = await evmNetwork.provider.eth.getBlock(blockNumber)
    return Number(timestamp) * MILLISECONDS_PER_SECOND
}

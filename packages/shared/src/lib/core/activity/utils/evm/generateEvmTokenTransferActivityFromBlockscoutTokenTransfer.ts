import { IAccountState } from '@core/account/interfaces'
import { IChain, NetworkNamespace } from '@core/network'
import { EvmTokenTransferActivity } from '../../types'
import { IBlockscoutTransaction } from '@auxiliary/blockscout'
import { ActivityAction, ActivityDirection, InclusionState } from '@core/activity/enums'
import { getAddressFromAccountForNetwork } from '@core/account'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'
import { BlockscoutTokenTransfer, isBlockscoutErc721Transfer } from '@auxiliary/blockscout/types'

export function generateEvmTokenTransferActivityFromBlockscoutTokenTransfer(
    blockscoutTokenTransfer: BlockscoutTokenTransfer,
    blockscoutTransaction: IBlockscoutTransaction | undefined,
    chain: IChain,
    account: IAccountState
): EvmTokenTransferActivity | undefined {
    const networkId = chain.getConfiguration().id
    const direction =
        getAddressFromAccountForNetwork(account, networkId) === blockscoutTokenTransfer.to.hash.toLowerCase()
            ? ActivityDirection.Incoming
            : ActivityDirection.Outgoing

    const sender = getSubjectFromAddress(blockscoutTokenTransfer.from.hash.toLowerCase(), networkId)
    const recipient = getSubjectFromAddress(blockscoutTokenTransfer.to.hash.toLowerCase(), networkId)

    const subject = direction === ActivityDirection.Outgoing ? recipient : sender
    const isInternal = isSubjectInternal(recipient)

    const transactionFee = blockscoutTransaction
        ? calculateGasFeeInGlow(blockscoutTransaction.gas_used ?? 0, blockscoutTransaction.gas_price)
        : undefined

    const tokenId = isBlockscoutErc721Transfer(blockscoutTokenTransfer)
        ? `${blockscoutTokenTransfer.token.address.toLowerCase()}:${blockscoutTokenTransfer.total.token_id}`
        : blockscoutTokenTransfer.token.address.toLowerCase()
    const rawAmount = isBlockscoutErc721Transfer(blockscoutTokenTransfer)
        ? BigInt(1)
        : BigInt(blockscoutTokenTransfer.total.value ?? 0)

    const tokenTransfer = {
        standard: blockscoutTokenTransfer.token.type.replace('-', '') as
            | TokenStandard.Erc20
            | TokenStandard.Irc30
            | NftStandard.Irc27
            | NftStandard.Erc721,
        tokenId,
        rawAmount,
    }

    // For native token transfers on L2, gasUsed is 0. Therefore we fallback to the estimatedGas
    // https://discord.com/channels/397872799483428865/930642258427019354/1168854453005332490
    return {
        namespace: NetworkNamespace.Evm,
        type: EvmActivityType.TokenTransfer,

        // meta information
        id: blockscoutTokenTransfer.tx_hash.toLowerCase(),
        action: ActivityAction.Send,
        containsValue: true, // TODO: check if why we do this

        transactionId: blockscoutTokenTransfer.tx_hash.toLowerCase(),
        time: new Date(blockscoutTokenTransfer.timestamp),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId, // TODO: what if sending to L1 ?
        sender,
        recipient,
        subject,
        direction,
        isInternal,

        contractAddress: blockscoutTokenTransfer.token.address.toLowerCase(),
        transactionFee,

        tokenTransfer,
    }
}

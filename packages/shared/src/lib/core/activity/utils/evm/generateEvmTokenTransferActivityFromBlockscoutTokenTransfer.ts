import { IAccountState } from '@core/account/interfaces'
import { EvmNetworkId, IChain, NetworkNamespace } from '@core/network'
import { BaseEvmActivity, EvmCoinTransferActivity, EvmTokenTransferActivity } from '../../types'
import { IBlockscoutTransaction } from '@auxiliary/blockscout'
import { ActivityAction, ActivityDirection, InclusionState } from '@core/activity/enums'
import { getAddressFromAccountForNetwork } from '@core/account'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { EvmActivityType } from '@core/activity/enums/evm'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'
import { BlockscoutTokenTransfer, isBlockscoutErc721Transfer } from '@auxiliary/blockscout/types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { persistErc721Nft } from '@core/nfts/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '@core/layer-2/constants'

export async function generateEvmTokenTransferActivityFromBlockscoutTokenTransfer(
    blockscoutTokenTransfer: BlockscoutTokenTransfer,
    blockscoutTransaction: IBlockscoutTransaction | undefined,
    chain: IChain,
    account: IAccountState
): Promise<EvmTokenTransferActivity | EvmCoinTransferActivity | undefined> {
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

    let tokenId: string | undefined
    let rawAmount: bigint | undefined
    if (isBlockscoutErc721Transfer(blockscoutTokenTransfer)) {
        const address = blockscoutTokenTransfer.token.address.toLowerCase()
        const tokenIndex = blockscoutTokenTransfer.total.token_id
        tokenId = `${address}:${tokenIndex}`
        rawAmount = BigInt(1)
        await persistErc721Nft(address, tokenIndex, networkId)
    } else {
        tokenId = blockscoutTokenTransfer.token.address.toLowerCase()
        rawAmount = BigInt(blockscoutTokenTransfer.total.value ?? 0)
        await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
    }

    const baseActivity: BaseEvmActivity = {
        namespace: NetworkNamespace.Evm,

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

        transactionFee,
    }

    if (tokenId === BASE_TOKEN_CONTRACT_ADDRESS[networkId as EvmNetworkId]) {
        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,

            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount,
            },
        }
    }

    return {
        ...baseActivity,
        type: EvmActivityType.TokenTransfer,

        tokenTransfer: {
            standard: blockscoutTokenTransfer.token.type.replace('-', '') as
                | TokenStandard.Erc20
                | TokenStandard.Irc30
                | NftStandard.Irc27
                | NftStandard.Erc721,
            tokenId,
            rawAmount,
        },
    }
}

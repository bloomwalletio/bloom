import { getDepositAddress } from '@core/account/utils/getDepositAddress'
import { logAndNotifyError } from '@core/error/actions'
import { handleLedgerError } from '@core/ledger/utils'
import { DEFAULT_BASE_TOKEN, SupportedNetworkId } from '@core/network'
import { BASE_TOKEN_ID, VerifiedStatus } from '@core/token'
import {
    DEFAULT_TRANSACTION_OPTIONS,
    SendFlowParameters,
    SendFlowType,
    SubjectType,
    getOutputParameters,
    setSendFlowParameters,
} from '@core/wallet'
import { get } from 'svelte/store'
import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    persistShimmerClaimingTransaction,
    updateShimmerClaimingAccount,
} from '../stores'

export async function claimShimmerRewards(): Promise<void> {
    const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const unclaimedShimmerClaimingAccounts =
        shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ?? []
    await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingAccount[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        try {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Claiming,
            })
            await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
        } catch (err) {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Failed,
            })
            if (get(isOnboardingLedgerProfile)) {
                handleLedgerError(err?.error ?? err)
            } else {
                logAndNotifyError({
                    type: 'error',
                    message: err,
                    localizationKey: 'notifications.claimShimmerRewards.error',
                    logToConsole: true,
                    saveToErrorLog: true,
                })
            }
        }
    }
}

async function claimShimmerRewardsForShimmerClaimingAccount(
    shimmerClaimingAccount: IShimmerClaimingAccount
): Promise<void> {
    const recipientAddress = await getDepositAddress(shimmerClaimingAccount?.twinAccount)
    const rawAmount = shimmerClaimingAccount?.unclaimedRewards

    const sendFlowParameters: SendFlowParameters = {
        recipient: {
            type: SubjectType.Address,
            address: recipientAddress,
        },
        type: SendFlowType.BaseCoinTransfer,
        baseCoinTransfer: {
            token: {
                id: BASE_TOKEN_ID,
                ...DEFAULT_BASE_TOKEN[SupportedNetworkId.Shimmer],
                networkId: SupportedNetworkId.Shimmer,
                hidden: false,
                verification: {
                    status: VerifiedStatus.Official,
                    verified: true,
                },
            },
            rawAmount: rawAmount.toString(),
        },
    }
    setSendFlowParameters(sendFlowParameters)

    const outputParams = await getOutputParameters(sendFlowParameters)
    const preparedOutput = await shimmerClaimingAccount?.prepareOutput(outputParams, DEFAULT_TRANSACTION_OPTIONS)

    const claimingTransaction = await shimmerClaimingAccount?.sendOutputs([preparedOutput])

    persistShimmerClaimingTransaction(claimingTransaction?.transactionId)

    const claimedRewards = shimmerClaimingAccount?.claimedRewards + rawAmount
    const unclaimedRewards = shimmerClaimingAccount?.unclaimedRewards - rawAmount
    updateShimmerClaimingAccount({
        ...shimmerClaimingAccount,
        /**
         * NOTE: We still explicitly set the state here to
         * display as "claiming" to user until it's updated
         * later by the transaction inclusion event handler.
         */
        state: ShimmerClaimingAccountState.Claiming,
        claimingTransaction,
        claimedRewards,
        unclaimedRewards,
    })
}

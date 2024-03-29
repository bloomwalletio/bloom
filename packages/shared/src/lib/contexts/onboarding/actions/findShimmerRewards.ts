import { IAccount } from '@core/account'
import { AccountRecoveryProfileConfiguration, UnableToFindProfileTypeError } from '@core/profile'
import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
import { zip } from '@core/utils'
import { get } from 'svelte/store'
import { SHIMMER_CLAIMING_ACCOUNT_RECOVERY_CONFIGURATION, SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS } from '../constants'
import { getSortedRenamedBoundAccounts, prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

const DEPTH_SEARCH_ACCOUNT_START_INDEX = 0
const INITIAL_SEARCH_ADDRESS_START_INDEX = 0
const INITIAL_SEARCH_ROUND = 1
const INITIAL_TOTAL_UNCLAIMED_REWARDS = BigInt(0)

/**
 * NOTE: This variable is uninitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let accountRecoveryProfileConfiguration: AccountRecoveryProfileConfiguration

let depthSearchAccountGapLimit: number
let depthSearchAddressStartIndex: number
let depthSearchAddressGapLimit: number

let breadthSearchAccountStartIndex: number
let breadthSearchAddressGapLimit: number

let totalUnclaimedShimmerRewards: bigint
let currentSearchRound: number

export function initialiseAccountRecoveryConfigurationForShimmerClaiming(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    accountRecoveryProfileConfiguration = SHIMMER_CLAIMING_ACCOUNT_RECOVERY_CONFIGURATION[profileType]

    depthSearchAccountGapLimit = accountRecoveryProfileConfiguration.initialAccountRange
    depthSearchAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX
    depthSearchAddressGapLimit = accountRecoveryProfileConfiguration.addressGapLimit

    breadthSearchAccountStartIndex = accountRecoveryProfileConfiguration.initialAccountRange
    breadthSearchAddressGapLimit = accountRecoveryProfileConfiguration.addressGapLimit

    currentSearchRound = INITIAL_SEARCH_ROUND
    totalUnclaimedShimmerRewards = INITIAL_TOTAL_UNCLAIMED_REWARDS
}

export async function findShimmerRewards(): Promise<void> {
    await depthSearchAndRecoverAccounts()

    if (hasOnlyDoneDepthSearch()) {
        await breadthSearchAndRecoverAccounts()
    }
    updateRewardsFinderParameters()
}

async function depthSearchAndRecoverAccounts(): Promise<void> {
    const recoverAccountsPayload: RecoverAccountsPayload = {
        accountStartIndex: DEPTH_SEARCH_ACCOUNT_START_INDEX,
        accountGapLimit: depthSearchAccountGapLimit,
        addressGapLimit: depthSearchAddressGapLimit,
        syncOptions: {
            ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
            addressStartIndex: depthSearchAddressStartIndex,
            addressStartIndexInternal: depthSearchAddressStartIndex,
        },
    }
    const depthSearchAccounts = await recoverAccounts(recoverAccountsPayload, shimmerClaimingProfileManager)

    await updateRecoveredAccounts(depthSearchAccounts)
}

async function breadthSearchAndRecoverAccounts(): Promise<void> {
    const { accountGapLimit, addressGapLimit } = accountRecoveryProfileConfiguration
    for (
        let chunkAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX;
        chunkAddressStartIndex < breadthSearchAddressGapLimit;
        chunkAddressStartIndex += addressGapLimit
    ) {
        const recoverAccountsPayload: RecoverAccountsPayload = {
            accountStartIndex: breadthSearchAccountStartIndex,
            accountGapLimit,
            addressGapLimit,
            syncOptions: {
                ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
                addressStartIndex: chunkAddressStartIndex,
                addressStartIndexInternal: chunkAddressStartIndex,
            },
        }
        const breadthSearchAccounts = await recoverAccounts(recoverAccountsPayload, shimmerClaimingProfileManager)

        await updateRecoveredAccounts(breadthSearchAccounts)
    }
}

function hasOnlyDoneDepthSearch(): boolean {
    const { numberOfRoundsBetweenBreadthSearch } = accountRecoveryProfileConfiguration
    return currentSearchRound % numberOfRoundsBetweenBreadthSearch === 0
}

function updateRewardsFinderParameters(): void {
    const hasSearchedOnlyDepth = hasOnlyDoneDepthSearch()

    const { accountGapLimit, addressGapLimit } = accountRecoveryProfileConfiguration

    depthSearchAccountGapLimit += hasSearchedOnlyDepth ? accountGapLimit : 0
    depthSearchAddressStartIndex += addressGapLimit

    breadthSearchAccountStartIndex += hasSearchedOnlyDepth ? accountGapLimit : 0
    breadthSearchAddressGapLimit += addressGapLimit

    currentSearchRound++
}

async function updateRecoveredAccounts(accounts: IAccount[]): Promise<void> {
    const boundAccounts = await getSortedRenamedBoundAccounts(accounts, shimmerClaimingProfileManager)
    const updatedTotalUnclaimedShimmerRewards = await sumTotalUnclaimedRewards(boundAccounts)
    const hasNewRewards = updatedTotalUnclaimedShimmerRewards > totalUnclaimedShimmerRewards
    if (hasNewRewards) {
        const boundTwinAccounts = await getSortedRenamedBoundAccounts(boundAccounts)
        for (const [boundAccount, boundTwinAccount] of zip(boundAccounts, boundTwinAccounts)) {
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(boundAccount, boundTwinAccount, true)
            updateShimmerClaimingAccount(shimmerClaimingAccount)
        }

        setTotalUnclaimedShimmerRewards(updatedTotalUnclaimedShimmerRewards)
    }
}

export function setTotalUnclaimedShimmerRewards(_totalUnclaimedShimmerRewards: bigint): void {
    totalUnclaimedShimmerRewards = _totalUnclaimedShimmerRewards
}

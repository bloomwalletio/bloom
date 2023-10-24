<script lang="ts">
    import { Icon, IconName, Spinner, Text, Tile } from '@bloomwalletio/ui'
    import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { IBaseToken, formatTokenAmountBestMatch } from '@core/token'

    export let shimmerClaimingAccount: IShimmerClaimingAccount
    export let baseToken: IBaseToken

    $: shouldDisplayFailedState = shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Failed
    $: shouldDisplayUnclaimedRewards = shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.FullyClaimed
    $: shouldDisplayClaimedRewards =
        shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.UnclaimedWithRewards &&
        shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.UnclaimedWithoutRewards
</script>

{#if shimmerClaimingAccount}
    <Tile border>
        <div class="w-full flex flex-row justify-between items-center gap-4">
            <div class="flex flex-row items-center text-left gap-3.5">
                <Icon name={IconName.Wallet} textColor="brand" />
                <Text type="body1">
                    {localize('general.account')}
                    {Number(shimmerClaimingAccount?.getMetadata()?.alias) + 1}
                </Text>
            </div>
            <div class="flex flex-col justify-end items-end">
                <Text type="body1" align="right">
                    {formatTokenAmountBestMatch(shimmerClaimingAccount?.unclaimedRewards, baseToken)}
                </Text>
                {#if shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Claiming}
                    <div class="flex justify-end items-center gap-1">
                        <Spinner size="xxs" textColor="warning" />
                        <Text type="sm" textColor="warning">
                            {localize('actions.claimingRewards').toLocaleLowerCase()}...
                        </Text>
                    </div>
                {:else if shouldDisplayUnclaimedRewards && shouldDisplayFailedState}
                    <div class="flex justify-end items-center gap-1">
                        <Icon size="xxs" name={IconName.CrossClose} textColor="danger" />
                        <Text type="sm" textColor="danger">
                            {localize('general.failed')}
                        </Text>
                    </div>
                {:else if shouldDisplayClaimedRewards && !shouldDisplayFailedState}
                    <div class="flex justify-end items-center gap-1">
                        <Icon size="xxs" name={IconName.Check} textColor="success" />
                        <Text type="sm" textColor="success">
                            {localize('general.claimed')}
                        </Text>
                    </div>
                {/if}
            </div>
        </div>
    </Tile>
{/if}

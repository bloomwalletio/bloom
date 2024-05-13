<script lang="ts">
    import { Icon, IconName, Spinner, Text, Tile } from '@bloomwalletio/ui'
    import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { IBaseToken, formatTokenAmount } from '@core/token'

    export let shimmerClaimingAccount: IShimmerClaimingAccount
    export let baseToken: IBaseToken | undefined

    $: shouldDisplayFailedState = shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Failed
    $: shouldDisplayClaimedState = shimmerClaimingAccount?.state === ShimmerClaimingAccountState.FullyClaimed
    $: total = shimmerClaimingAccount?.unclaimedRewards + shimmerClaimingAccount?.claimedRewards
</script>

{#if shimmerClaimingAccount}
    <Tile border>
        <container class="w-full flex flex-row justify-between items-center gap-4">
            <div class="flex flex-row items-center text-left gap-3.5">
                <Icon name={IconName.Wallet} textColor="brand" />
                <Text type="body1">
                    {localize('general.account')}
                    {Number(shimmerClaimingAccount?.getMetadata()?.alias) + 1}
                </Text>
            </div>
            <div class="flex flex-col justify-end items-end">
                <Text type="body1" align="right">
                    {formatTokenAmount(total, baseToken)}
                </Text>
                {#if shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Claiming}
                    <div class="flex justify-end items-center gap-1">
                        <Spinner size="xxs" textColor="warning" />
                        <Text type="sm" textColor="warning">
                            {localize('actions.claimingRewards').toLocaleLowerCase()}
                        </Text>
                    </div>
                {:else if !shouldDisplayClaimedState && shouldDisplayFailedState}
                    <div class="flex justify-end items-center gap-1">
                        <Icon size="xxs" name={IconName.CrossClose} textColor="danger" />
                        <Text type="sm" textColor="danger">
                            {localize('general.failed')}
                        </Text>
                    </div>
                {:else if shouldDisplayClaimedState && !shouldDisplayFailedState}
                    <div class="flex justify-end items-center gap-1">
                        <Icon size="xxs" name={IconName.Check} textColor="success" />
                        <Text type="sm" textColor="success">
                            {localize('general.claimed')}
                        </Text>
                    </div>
                {/if}
            </div>
        </container>
    </Tile>
{/if}

<style lang="scss">
    container {
        height: 44px;
    }
</style>

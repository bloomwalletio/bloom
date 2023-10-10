<script lang="ts">
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
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
            <div class="flex flex-row items-center text-left gap-2">
                <Icon name={IconName.Wallet} textColor="brand" />
                <Text type="body2">
                    {localize('general.account')}
                    {Number(shimmerClaimingAccount?.getMetadata()?.alias) + 1}
                </Text>
            </div>
            <div class="flex flex-col">
                {#if shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Claiming}
                    <Text textColor="secondary">
                        {`${localize('actions.claimingRewards')}...`}
                    </Text>
                {:else}
                    {#if shouldDisplayUnclaimedRewards}
                        <div class="flex flex-row justify-end items-center text-right gap-2">
                            <Text textColor="secondary">
                                {formatTokenAmountBestMatch(shimmerClaimingAccount?.unclaimedRewards, baseToken)}
                            </Text>
                            {#if shouldDisplayFailedState}
                                <Icon size="xs" name={IconName.CrossSquare} textColor="danger" />
                            {/if}
                        </div>
                    {/if}
                    {#if shouldDisplayClaimedRewards && !shouldDisplayFailedState}
                        <div class="flex flex-row justify-end items-center text-right gap-2">
                            <Text textColor="secondary">
                                {localize('general.amountClaimed', {
                                    values: {
                                        amount: formatTokenAmountBestMatch(
                                            shimmerClaimingAccount?.claimedRewards,
                                            baseToken
                                        ),
                                    },
                                })}
                            </Text>
                            <Icon size="xs" name={IconName.SuccessCircle} textColor="success" />
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </Tile>
{/if}

<script lang="ts">
    import { ShimmerClaimingAccountTile } from '@ui'
    import { IShimmerClaimingAccount } from '@contexts/onboarding'
    import { IBaseToken } from '@core/token'

    export let shimmerClaimingAccounts: IShimmerClaimingAccount[]
    export let baseToken: IBaseToken | undefined
</script>

{#if shimmerClaimingAccounts && shimmerClaimingAccounts?.length > 0}
    <div class="flex-auto overflow-y-auto max-h-80 space-y-2 w-full scrollable-y">
        {#each shimmerClaimingAccounts as shimmerClaimingAccount}
            <ShimmerClaimingAccountTile {shimmerClaimingAccount} {baseToken} />
        {/each}
    </div>
{/if}

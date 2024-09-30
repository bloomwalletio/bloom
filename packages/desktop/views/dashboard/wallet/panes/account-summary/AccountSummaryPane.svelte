<script lang="ts">
    import { Pane } from '@ui'
    import { AccountNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { networks } from '@core/network'

    export let account: IAccountState

    const ACCOUNT_NETWORK_SUMMARY_MAXIMUM_WIDTH_IN_PX = 300

    let accountSummaryListWidth: number
    let accountSummaryWidth: number
</script>

<Pane
    classes="
        w-full flex shrink-0 flex
        bg-surface dark:bg-surface-dark
        border border-solid border-stroke dark:border-stroke-dark
        divide-x divide-solid divide-stroke dark:divide-stroke-dark
        shadow-lg
    "
>
    <div
        class="flex-1 flex divide-x divide-solid divide-stroke dark:divide-stroke-dark"
        bind:clientWidth={accountSummaryListWidth}
    >
        <div bind:clientWidth={accountSummaryWidth}>
            <AccountSummary />
        </div>
        {#each $networks as network, i}
            {#if i * ACCOUNT_NETWORK_SUMMARY_MAXIMUM_WIDTH_IN_PX <= accountSummaryListWidth - accountSummaryWidth}
                <AccountNetworkSummary {account} {network} />
            {/if}
        {/each}
    </div>
</Pane>

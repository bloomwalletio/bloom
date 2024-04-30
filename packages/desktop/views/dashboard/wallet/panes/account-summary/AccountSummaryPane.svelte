<script lang="ts">
    import { Pane } from '@ui'
    import { AccountNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { networks } from '@core/network'

    export let account: IAccountState

    const GRID_COLS = {
        0: 'grid-cols-1',
        1: 'grid-cols-2',
        2: 'grid-cols-3',
        3: 'grid-cols-4',
    }
</script>

<Pane
    classes="
        w-full flex shrink-0 grid {GRID_COLS[$networks.length] ?? GRID_COLS[3]}
        bg-surface dark:bg-surface-dark
        border border-solid border-stroke dark:border-stroke-dark
        divide-x divide-solid divide-stroke dark:divide-stroke-dark
        shadow-lg
    "
>
    <AccountSummary />
    {#each $networks as network}
        <AccountNetworkSummary {account} {network} />
    {/each}
</Pane>

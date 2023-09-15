<script lang="ts">
    import { Pane } from '@ui'
    import { AccountNetworkSummary, AccountSummaryBalance } from './components'
</script>

<Pane classes="w-full flex flex-row shrink-0 justify-between items-center border border-solid border-gray-100">
    <AccountSummaryBalance />
    <div class="middle w-full">
        <AccountNetworkSummary />
    </div>
    <AccountNetworkSummary />
</Pane>

<style lang="postcss">
    .middle {
        border-left: 1px solid #f1eef9;
        border-right: 1px solid #f1eef9;
    }
</style>

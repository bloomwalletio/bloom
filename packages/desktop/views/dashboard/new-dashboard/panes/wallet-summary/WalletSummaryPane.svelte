<script lang="ts">
    import { Pane } from '@ui'
    import { WalletSummaryBalance } from './components'
</script>

<Pane classes="w-full h-full flex flex-row justify-between items-center divide-y divide-gray-500">
    <WalletSummaryBalance />
    <WalletSummaryBalance />
    <WalletSummaryBalance />
</Pane>

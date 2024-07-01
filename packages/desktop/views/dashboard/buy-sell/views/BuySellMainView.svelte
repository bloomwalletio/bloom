<script lang="ts">
    import { TransakConnectionPanel, TransakInfoPanel, TransakExchangePanel } from '../components'

    let transakExchangePanel: TransakExchangePanel
</script>

<div class="flex justify-center gap-4 h-full w-full">
    <div class="flex flex-col gap-4 max-w-[20rem] h-full">
        <TransakConnectionPanel refreshFunction={transakExchangePanel?.resetTransak} />
        <TransakInfoPanel />
    </div>
    <div class="w-[25rem] shrink-0 h-fit">
        <TransakExchangePanel bind:this={transakExchangePanel} />
    </div>
</div>

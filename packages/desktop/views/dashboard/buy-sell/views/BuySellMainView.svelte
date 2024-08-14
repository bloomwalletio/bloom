<script lang="ts">
    import { TransakExchangePanel } from '../components'

    let transakExchangePanel: TransakExchangePanel
</script>

<div class="flex justify-center gap-4 h-full w-full">
    <div class="w-[40rem] shrink-0 h-[28rem]">
        <TransakExchangePanel bind:this={transakExchangePanel} />
    </div>
</div>

<script lang="ts">
    import { Copyable, Text } from '@bloomwalletio/ui'
    import { darkMode } from '@core/app/stores'
    import { QR } from '@ui'

    export let title = ''
    export let address = ''
    export let showQr = false

    let copyableElement: Copyable

    export function copyAddress(): void {
        copyableElement.onClick()
    }
</script>

<Copyable value={address}>
    <address-container class="flex flex-col" class:darkmode={$darkMode}>
        <inner-box class="flex flex-col gap-6 pt-7 pb-6">
            <Text type="h6" textColor="brand">{title}</Text>
            {#if showQr}
                <QR data={address} />
            {/if}
            <div class="flex flex-col gap-1">
                {#if address.length > 20}
                    <div class="flex flex-col">
                        <Text type="pre-lg">
                            {address.slice(0, address.length / 2)}
                        </Text>
                        <Text type="pre-lg">
                            {address.slice(address.length / 2)}
                        </Text>
                    </div>
                {:else}
                    <Text type="pre-lg">
                        {address}
                    </Text>
                {/if}
            </div>
        </inner-box>
    </address-container>
</Copyable>

<style lang="postcss">
    address-container {
        @apply border border-solid border-stroke dark:border-stroke-dark rounded-xl;
        @apply bg-surface dark:bg-surface-dark;
        @apply hover:bg-surface-1 dark:hover:bg-surface-1-dark;
        @apply p-4 gap-2;
        @apply cursor-pointer;
    }
</style>

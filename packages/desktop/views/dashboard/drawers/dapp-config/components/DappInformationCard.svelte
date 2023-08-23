<script lang="ts">
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { localize } from '@core/i18n'
    import { Tile, FontWeight, Text } from '@ui'
    import TextHint from '@ui/TextHint.svelte'

    $: metadata = $sessionProposal?.params.proposer.metadata
</script>

<Tile classes="bg-white border border-solid border-gray-200 dark:border-transparent">
    <div class="w-full h-full flex flex-col p-4 gap-4">
        <div class="flex flex-row gap-4 items-center">
            <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
            <div class="flex flex-col">
                <Text fontSize="16" fontWeight={FontWeight.semibold}>
                    {metadata?.name}
                </Text>
                <Text fontSize="13">
                    {metadata?.name}
                </Text>
            </div>
        </div>
        <TextHint warning text={localize('views.dashboard.drawers.dApps.confirmConnection.hint')} />
    </div>
</Tile>

<style lang="scss">
    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>

<script lang="ts">
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { FontWeight, Text, Tile } from '@ui'

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
                    {metadata?.url}
                </Text>
            </div>
        </div>
        <Alert variant="warning" text={localize('views.dashboard.drawers.dapps.confirmConnection.hint')} />
    </div>
</Tile>

<style lang="scss">
    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>

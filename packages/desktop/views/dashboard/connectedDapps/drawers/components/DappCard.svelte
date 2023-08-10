<script lang="ts">
    import { Pairing } from '@auxiliary/wallet-connect/interface/pairing.interface'
    import { localize } from '@core/i18n'
    import { ClickableTile, FontWeight, Pill, Text } from '@ui'

    export let pairing: Pairing = undefined

    function onCardClick(): void {
        // TODO
    }
    const localeKey = 'views.dashboard.drawers.connectedDapps.connectedDappsList.state.'
    $: pill = pairing.active
        ? {
              data: '• ' + localize(localeKey + 'connected'),
              textColor: 'green-800',
              backgroundColor: 'green-100',
          }
        : {
              data: '• ' + localize(localeKey + 'disconnected'),
              textColor: 'orange-700',
              backgroundColor: 'orange-100',
          }
</script>

<ClickableTile classes="bg-white border border-solid border-gray-200 dark:border-transparent" onClick={onCardClick}>
    <div class="w-full flex flex-row justify-between items-center p-2">
        <div class="flex flex-row gap-4 items-center">
            <img class="pairing-image" src={pairing.peerMetadata?.icons?.[0]} alt={pairing.peerMetadata?.name} />
            <Text fontSize="14" fontWeight={FontWeight.semibold}>
                {pairing.peerMetadata?.name}
            </Text>
        </div>

        <Pill {...pill} />
    </div>
</ClickableTile>

<style lang="scss">
    .pairing-image {
        width: 30px;
        height: 30px;
        border-radius: 10px;
    }
</style>

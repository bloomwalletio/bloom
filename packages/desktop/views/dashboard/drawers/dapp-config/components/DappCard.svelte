<script lang="ts">
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { localize } from '@core/i18n'
    import { ClickableTile, FontWeight, Pill, Text } from '@ui'

    export let connectedDapp: IConnectedDapp = undefined

    function onCardClick(): void {
        // TODO
    }

    $: pill = connectedDapp.active
        ? {
              data: '• ' + localize('general.connected'),
              textColor: 'green-800',
              backgroundColor: 'green-100',
          }
        : {
              data: '• ' + localize('general.disconnected'),
              textColor: 'orange-700',
              backgroundColor: 'orange-100',
          }
</script>

<ClickableTile classes="bg-white border border-solid border-gray-200 dark:border-transparent" onClick={onCardClick}>
    <div class="w-full flex flex-row justify-between items-center p-2">
        <div class="flex flex-row gap-4 items-center">
            <img
                class="connected-dapp-image"
                src={connectedDapp.metadata?.icons?.[0]}
                alt={connectedDapp.metadata?.name}
            />
            <Text fontSize="14" fontWeight={FontWeight.semibold}>
                {connectedDapp.metadata?.name}
            </Text>
        </div>

        <Pill {...pill} />
    </div>
</ClickableTile>

<style lang="scss">
    .connected-dapp-image {
        width: 30px;
        height: 30px;
        border-radius: 10px;
    }
</style>

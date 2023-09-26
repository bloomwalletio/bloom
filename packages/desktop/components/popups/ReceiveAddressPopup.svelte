<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { QR, AddressBox } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'

    $: receiveAddress = $selectedAccount.depositAddress
</script>

<receive-address-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type="h5" textColor="text-brand">{localize('popups.receiveAddress.title')}</Text>
    <Text type="body2" textColor="text-secondary">{localize('popups.receiveAddress.body')}</Text>
    <div
        class="w-full py-6 space-y-6 flex flex-col items-center rounded-xl border border-solid border-stroke bg-surface-1"
    >
        <Text type="h6" textColor="text-brand"
            >{localize('popups.receiveAddress.networkAddress', { networkName: 'Shimmer' })}</Text
        >
        <QR data={receiveAddress} classes="w-1/2 h-1/2" />
        <AddressBox address={receiveAddress} clearBackground isCopyable />
    </div>
    <Button text={localize('actions.copyAddress')} on:click={() => setClipboard(receiveAddress)} />
</receive-address-popup>

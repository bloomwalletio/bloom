<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { QR, AddressBox } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'

    $: receiveAddress = $selectedAccount.depositAddress
</script>

<receive-details class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type="h5" textColor="text-brand">{localize('actions.receive')}</Text>
    <div class="w-full flex flex-col items-center space-y-6">
        <QR data={receiveAddress} classes="w-1/2 h-1/2" />
        <AddressBox address={receiveAddress} clearBackground isCopyable />
    </div>
    <Button text={localize('actions.copyAddress')} on:click={() => setClipboard(receiveAddress)} />
</receive-details>

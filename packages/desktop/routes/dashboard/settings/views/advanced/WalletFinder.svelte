<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { Text } from '@ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onWalletFinderClick(): void {
        openPopup({ id: PopupId.WalletFinder })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.walletFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.walletFinder.description')}</Text>
<div class="flex flex-row items-center">
    <Button size="md" on:click={onWalletFinderClick} text={localize('actions.findWallets')} />
</div>

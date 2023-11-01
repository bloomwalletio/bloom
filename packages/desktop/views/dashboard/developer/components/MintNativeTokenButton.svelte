<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { resetMintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { ButtonTile } from '../../../components'

    $: hasAliases = $selectedAccount.balances?.aliases.length > 0

    function onMintNativeTokenClick(): void {
        resetMintTokenDetails()
        if (hasAliases) {
            openPopup({
                id: PopupId.MintNativeTokenForm,
            })
        } else {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.noAlias.title'),
                    alert: { variant: 'warning', text: localize('popups.noAlias.description') },
                    confirmText: localize('actions.createAlias'),
                    onConfirm: () => {
                        closePopup()
                        openPopup({
                            id: PopupId.AliasConfirmation,
                        })
                    },
                },
            })
        }
    }
</script>

<ButtonTile
    primaryText={localize('actions.mintNativeToken')}
    secondaryText={localize('general.mintNativeTokenDescription')}
    onClick={onMintNativeTokenClick}
    icon={IconName.CoinSwap}
/>

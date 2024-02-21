<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { ButtonTile } from '../../../components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { resetMintNftCollectionDetails } from '@core/wallet'

    function onMintNftCollectionClick(): void {
        resetMintNftCollectionDetails()
        openPopup({
            id: PopupId.MintNftCollectionForm,
            confirmClickOutside: true,
        })
    }
</script>

<ButtonTile
    primaryText={localize('actions.mintNftCollection')}
    secondaryText={localize('general.mintNftCollectionDescription')}
    onClick={onMintNftCollectionClick}
    icon={IconName.Image}
/>

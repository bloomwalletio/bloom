<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { ButtonTile } from '../../../components'
    import { localize } from '@core/i18n'
    import { resetMintNftDetails } from '@core/wallet'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onMintNftClick(): void {
        resetMintNftDetails()
        openPopup({
            id: PopupId.MintNftForm,
        })
    }
</script>

<ButtonTile
    primaryText={localize('actions.mintNft')}
    secondaryText={localize('general.mintNftDescription')}
    onClick={onMintNftClick}
    icon={IconName.Image}
/>

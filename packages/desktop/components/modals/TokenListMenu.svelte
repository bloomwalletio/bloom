<script lang="ts">
    import { localize } from '@core/i18n'
    import { Icon } from '@lib/auxiliary/icon'
    import { openPopup, PopupId } from '../../lib/auxiliary/popup'
    import { MenuItem, Modal } from '@ui'

    export let modal: Modal = undefined

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Tokens}
            iconProps={{ secondaryColor: 'white' }}
            title={localize('general.importErc20Token')}
            onClick={onImportErc20TokenClick}
        />
    </div>
</Modal>

<script lang="ts">
    import { localize } from '@core/i18n'
    import { Icon } from '@lib/auxiliary/icon'
    import { openPopup, PopupId } from '../../lib/auxiliary/popup'
    import { MeatballMenuButton, MenuItem, Modal } from '@ui'

    let modal: Modal = undefined

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
    }
</script>

<token-list-menu class="relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <Modal bind:this={modal} position={{ right: '0' }} {...$$restProps}>
        <div class="flex flex-col">
            <MenuItem
                icon={Icon.Tokens}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('general.importErc20Token')}
                onClick={onImportErc20TokenClick}
            />
        </div>
    </Modal>
</token-list-menu>

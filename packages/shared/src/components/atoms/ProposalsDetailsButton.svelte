<script lang="typescript">
    import { Modal, MeatballMenuButton, MenuItem, ModalPosition } from '@ui'
    import { Icon } from '@auxiliary/icon'
    import { openPopup, PopupId } from '../../../../desktop/lib/auxiliary/popup'
    import { localize } from '@core/i18n'

    export let modalPosition: ModalPosition | undefined = undefined

    let modal: Modal | undefined

    function onRevoteClick(): void {
        openPopup({
            id: PopupId.Revote,
        })
        modal?.close()
    }
</script>

<MeatballMenuButton onClick={() => modal?.toggle()} />
<Modal bind:this={modal} position={modalPosition} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Delete}
            iconProps={{ width: '16', height: '19' }}
            title={localize('actions.revote')}
            onClick={onRevoteClick}
        />
    </div>
</Modal>

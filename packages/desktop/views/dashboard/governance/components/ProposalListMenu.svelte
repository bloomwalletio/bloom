<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    let menu: Menu | undefined

    function onAddProposalClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            overflow: true,
        })
        menu?.close()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Import,
            title: localize('actions.addProposal'),
            onClick: onAddProposalClick,
        },
    ]}
/>

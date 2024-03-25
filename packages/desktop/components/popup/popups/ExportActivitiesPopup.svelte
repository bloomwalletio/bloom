<script lang="ts">
    import { localize } from '@core/i18n'
    import { Logo } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LogoName } from '@auxiliary/logo'
    import PopupTemplate from '../PopupTemplate.svelte'

    const busy = false

    function onCancelClick(): void {
        closePopup()
    }

    function onExportClick(): void {
        // TODO: implement CSV export
    }
</script>

<PopupTemplate
    title={localize('popups.exportActivities.title')}
    description={localize('popups.exportActivities.bod')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: busy,
    }}
    continueButton={{
        text: localize('actions.export'),
        onClick: onExportClick,
        disabled: busy,
    }}
    {busy}
>
    <div class="flex flex-col space-y-5">
        <div class="w-full p-10 bg-surface-1 dark:bg-surface-1-dark rounded-xl flex justify-center content-center">
            <Logo width="50%" logo={LogoName.Stronghold} />
        </div>
        <div class="w-full">
            <Text textColor="secondary" align="justify">
                {localize('popups.backupStronghold.body')}
            </Text>
        </div>
    </div>
</PopupTemplate>

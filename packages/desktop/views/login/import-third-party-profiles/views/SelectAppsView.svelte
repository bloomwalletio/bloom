<script lang="ts">
    import { ThirdPartyAppName } from '@auxiliary/third-party/enums'
    import { Checkbox } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components/popup'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { importThirdPartyProfilesRouter } from '../import-third-party-profiles.router'

    const availableApps: ThirdPartyAppName[] = Object.values(ThirdPartyAppName)
    export let selectedApps: { [key in ThirdPartyAppName]?: boolean } = availableApps.reduce((acc, app) => {
        acc[app] = false
        return acc
    }, {})

    function onCancelClick() {
        closePopup()
    }

    function onContinueClick() {
        $importThirdPartyProfilesRouter.next()
    }
</script>

<PopupTemplate
    title={localize('popups.importProfilesFromThirdParty.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
    }}
>
    <div class="flex flex-col gap-2">
        {#each availableApps as appName}
            <Checkbox label={appName} bind:checked={selectedApps[appName]} />
        {/each}
    </div>
</PopupTemplate>
